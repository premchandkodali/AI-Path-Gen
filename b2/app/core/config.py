from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Database - SQLite for local development  
    DATABASE_URL: str = "sqlite:///./learning_platform.db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-with-complex-string"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    PASSWORD_MIN_LENGTH: int = 8
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*"]
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI Learning Path Generator API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for AI-Powered Personalized Learning Path Generator"
    
    # ML Model Settings
    MODEL_PATH: str = "./app/ml/models/"
    NSQF_DATA_PATH: str = "./app/data/nsqf/"
    RECOMMENDATION_MODEL_PATH: str = "./app/ml/models/recommendation_model.pkl"
    
    # External APIs
    JOB_MARKET_API_KEY: Optional[str] = None
    JOB_MARKET_API_URL: str = "https://api.jobmarket.example.com"
    
    # Redis (for caching and background tasks)
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_EXPIRE_MINUTES: int = 60
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    
    # Email (for notifications)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Gamification
    XP_PER_LESSON: int = 50
    XP_PER_QUIZ_COMPLETION: int = 100
    XP_PER_COURSE_COMPLETION: int = 500
    POINTS_PER_QUIZ_CORRECT: int = 10
    LEVEL_XP_MULTIPLIER: int = 1000
    
    # Analytics
    ANALYTICS_RETENTION_DAYS: int = 365
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()