from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
from app.core.config import Settings
from app.core.database import init_db
from app.core.security import SECURITY_HEADERS
from app.api import auth, users, courses, interactive_modules

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

settings = Settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting up AI-Powered Learning Path Generator API")
    init_db()
    logger.info("Database initialized successfully")
    yield
    # Shutdown
    logger.info("Shutting down AI-Powered Learning Path Generator API")

app = FastAPI(
    title="AI-Powered Learning Path Generator",
    description="Smart India Hackathon 2024 - Personalized Learning Platform",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=settings.ALLOWED_HOSTS
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Custom middleware for security headers and logging
@app.middleware("http")
async def add_security_headers_and_logging(request: Request, call_next):
    """Add security headers and request logging"""
    start_time = time.time()
    
    # Log incoming request
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    
    response = await call_next(request)
    
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        f"Request processed: {request.method} {request.url.path} "
        f"- Status: {response.status_code} - Time: {process_time:.4f}s"
    )
    
    return response

# Exception handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"},
        headers=SECURITY_HEADERS
    )

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers=SECURITY_HEADERS
    )

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(interactive_modules.router, prefix="/api/v1")

@app.get("/")
async def root(response: Response):
    """Root endpoint"""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    return {
        "message": "AI-Powered Learning Path Generator API",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs" if settings.DEBUG else "Not available in production",
        "health_check": "/health"
    }

@app.get("/health")
async def health_check(response: Response):
    """Health check endpoint"""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "AI Learning Path Generator",
        "version": "1.0.0"
    }

@app.get("/api/v1/info")
async def api_info(response: Response):
    """API information endpoint"""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    return {
        "api_version": "v1",
        "title": "AI-Powered Learning Path Generator",
        "description": "Personalized Learning Platform for Smart India Hackathon 2024",
        "features": [
            "User Authentication & Authorization",
            "Course Management",
            "Learning Path Generation",
            "Progress Tracking",
            "Gamification System",
            "Quiz & Assessment Engine",
            "Achievement System"
        ],
        "endpoints": {
            "authentication": "/api/v1/auth",
            "users": "/api/v1/users",
            "courses": "/api/v1/courses",
            "learning_pathways": "/api/v1/pathways",
            "quizzes": "/api/v1/quizzes",
            "achievements": "/api/v1/achievements"
        }
    }