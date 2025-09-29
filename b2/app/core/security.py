from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.hash import bcrypt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import Settings
from app.core.database import get_db
from app.models.database import User
from app.models.schemas import TokenData
import secrets
import string

settings = Settings()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def validate_password(password: str) -> bool:
    """Validate password strength"""
    if len(password) < settings.PASSWORD_MIN_LENGTH:
        return False
    
    # Check for at least one lowercase, uppercase, digit
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    
    return has_lower and has_upper and has_digit

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> Optional[TokenData]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        token_type_claim: str = payload.get("type")
        
        if username is None or token_type_claim != token_type:
            return None
        
        return TokenData(username=username)
    except JWTError:
        return None

def generate_verification_code(length: int = 6) -> str:
    """Generate a random verification code"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

def generate_reset_token() -> str:
    """Generate a secure reset token"""
    return secrets.token_urlsafe(32)

def authenticate_user(db: Session, username: str, password: str) -> Union[User, bool]:
    """Authenticate user with username/email and password"""
    # Try to find user by username or email
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    
    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current admin user"""
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def get_current_instructor_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current instructor or admin user"""
    if current_user.role.value not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

class RateLimiter:
    """Simple rate limiter for API endpoints"""
    def __init__(self):
        self.requests = {}
        self.window_size = 60  # 1 minute
        self.max_requests = settings.RATE_LIMIT_PER_MINUTE
    
    def is_allowed(self, identifier: str) -> bool:
        """Check if request is allowed based on rate limit"""
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=self.window_size)
        
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Remove old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]
        
        # Check if under limit
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(now)
        return True

rate_limiter = RateLimiter()

def check_rate_limit(identifier: str):
    """Dependency to check rate limits"""
    if not rate_limiter.is_allowed(identifier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )

# Permission decorators
def require_permissions(*required_roles):
    """Decorator to require specific roles for endpoint access"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user or current_user.role.value not in required_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Security headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}