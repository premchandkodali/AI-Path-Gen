from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.config import Settings
import logging

logger = logging.getLogger(__name__)

settings = Settings()

# Create SQLAlchemy engine
# Configure differently for SQLite vs PostgreSQL
if "sqlite" in settings.DATABASE_URL:
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
        echo=settings.DEBUG
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        echo=settings.DEBUG
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """Initialize the database (placeholder)."""
    pass

## All test/demo data creation logic removed for production readiness.