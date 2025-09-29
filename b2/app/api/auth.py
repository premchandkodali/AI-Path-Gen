from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    authenticate_user, 
    create_access_token, 
    create_refresh_token,
    get_password_hash,
    validate_password,
    verify_token,
    check_rate_limit,
    get_current_user,
    SECURITY_HEADERS
)
from app.models.database import User
from app.models.schemas import (
    UserCreate, 
    UserProfile, 
    Token, 
    LoginRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    EmailVerification
)
from app.core.config import Settings
import logging

settings = Settings()
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate, 
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"register_{client_ip}")
    
    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength
    if not validate_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters and contain uppercase, lowercase, and digit"
        )
    
    # Create new user
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role,
        is_active=True,  # In production, this might be False until email verification
        is_verified=False
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    logger.info(f"New user registered: {user_data.username}")
    
    return UserProfile.from_orm(db_user)

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access token"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"login_{client_ip}")
    
    # Authenticate user
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        logger.warning(f"Failed login attempt for: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access and refresh tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    # Update user's last login
    user.last_login = db.query(User).filter(User.id == user.id).first().updated_at
    db.commit()
    
    logger.info(f"User logged in: {user.username}")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    "user": UserProfile.from_orm(user)
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"refresh_{client_ip}")
    
    # Verify refresh token
    token_data = verify_token(refresh_token, token_type="refresh")
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user
    user = db.query(User).filter(User.username == token_data.username).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,  # Keep the same refresh token
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    "user": UserProfile.from_orm(user)
    }

@router.post("/logout")
async def logout(
    response: Response,
    current_user: User = Depends(get_current_user)
):
    """Logout user (client should discard tokens)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    logger.info(f"User logged out: {current_user.username}")
    
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(
    request: Request,
    response: Response,
    password_reset: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Request password reset"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"forgot_{client_ip}")
    
    # Find user by email
    user = db.query(User).filter(User.email == password_reset.email).first()
    
    # Always return success to prevent email enumeration
    message = "If the email exists, a password reset link has been sent"
    
    if user:
        # In production, generate reset token and send email
        # For now, just log the action
        logger.info(f"Password reset requested for: {user.email}")
        
        # Here you would:
        # 1. Generate a secure reset token
        # 2. Store it in database with expiration
        # 3. Send email with reset link
    
    return {"message": message}

@router.post("/reset-password")
async def reset_password(
    request: Request,
    response: Response,
    password_reset_confirm: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """Reset password with token"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"reset_{client_ip}")
    
    # Validate new password
    if not validate_password(password_reset_confirm.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters and contain uppercase, lowercase, and digit"
        )
    
    # In production, you would:
    # 1. Verify the reset token
    # 2. Check if it's not expired
    # 3. Update the user's password
    # 4. Invalidate the reset token
    
    # Production: remove demonstration logic
    logger.info(f"Password reset completed for token: {password_reset_confirm.token[:10]}...")
    
    return {"message": "Password has been reset successfully"}

@router.post("/verify-email")
async def verify_email(
    request: Request,
    response: Response,
    email_verification: EmailVerification,
    db: Session = Depends(get_db)
):
    """Verify email address"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Rate limiting
    client_ip = request.client.host
    check_rate_limit(f"verify_{client_ip}")
    
    # In production, you would:
    # 1. Verify the email verification token
    # 2. Update user's is_verified status
    # 3. Invalidate the verification token
    
    logger.info(f"Email verification attempted with token: {email_verification.token[:10]}...")
    
    return {"message": "Email has been verified successfully"}

@router.get("/me", response_model=UserProfile)
async def read_users_me(
    response: Response,
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    return UserProfile.from_orm(current_user)

@router.get("/validate-token")
async def validate_token_endpoint(
    response: Response,
    current_user: User = Depends(get_current_user)
):
    """Validate if current token is valid"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    return {
        "valid": True,
        "user_id": current_user.id,
        "username": current_user.username,
        "role": current_user.role.value
    }