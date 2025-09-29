from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class NSQFLevel(Base):
    __tablename__ = "nsqf_levels"
    id = Column(Integer, primary_key=True, index=True)
    level = Column(Integer, unique=True, nullable=False)
    description = Column(String, nullable=False)
    job_roles = relationship("JobRole", back_populates="nsqf_level")

class JobRole(Base):
    __tablename__ = "job_roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    nsqf_level_id = Column(Integer, ForeignKey("nsqf_levels.id"))
    nsqf_level = relationship("NSQFLevel", back_populates="job_roles")
