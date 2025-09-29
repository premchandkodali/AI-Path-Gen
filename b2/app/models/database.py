from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, Table, JSON, Enum
from app.core.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum



# Association tables for many-to-many relationships
user_courses = Table(
    'user_courses',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('enrolled_at', DateTime, default=func.now()),
    Column('completed_at', DateTime, nullable=True),
    Column('progress', Float, default=0.0),
    Column('last_accessed', DateTime, default=func.now())
)

user_pathways = Table(
    'user_pathways',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('pathway_id', Integer, ForeignKey('learning_pathways.id'), primary_key=True),
    Column('enrolled_at', DateTime, default=func.now()),
    Column('completed_at', DateTime, nullable=True),
    Column('progress', Float, default=0.0)
)

pathway_courses = Table(
    'pathway_courses',
    Base.metadata,
    Column('pathway_id', Integer, ForeignKey('learning_pathways.id'), primary_key=True),
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('order_index', Integer, default=0),
    Column('is_required', Boolean, default=True)
)

user_achievements = Table(
    'user_achievements',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('achievement_id', Integer, ForeignKey('achievements.id'), primary_key=True),
    Column('earned_at', DateTime, default=func.now())
)

course_skills = Table(
    'course_skills',
    Base.metadata,
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skills.id'), primary_key=True),
    Column('proficiency_level', String(50), default='beginner')
)

class UserRole(enum.Enum):
    student = "student"
    instructor = "instructor"
    policymaker = "policymaker"
    admin = "admin"

class DifficultyLevel(enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTIPLE_SELECT = "multiple_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    CODE_COMPLETION = "code_completion"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student)
    
    # Profile information
    profile_picture = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    location = Column(String(200), nullable=True)
    
    # Learning preferences
    learning_style = Column(String(50), nullable=True)  # visual, auditory, kinesthetic
    preferred_difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    time_commitment = Column(String(50), nullable=True)  # hours per week
    goals = Column(JSON, nullable=True)
    interests = Column(JSON, nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    last_login = Column(DateTime, nullable=True)
    
    # Gamification
    total_xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    total_points = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    
    # Relationships
    courses = relationship("Course", secondary=user_courses, back_populates="enrolled_users")
    pathways = relationship("LearningPathway", secondary=user_pathways, back_populates="enrolled_users")
    achievements = relationship("Achievement", secondary=user_achievements, back_populates="users")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    progress_records = relationship("ProgressRecord", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    nsqf_level = Column(Integer, nullable=True)
    
    # Relationships
    courses = relationship("Course", secondary=course_skills, back_populates="skills")

class LearningPathway(Base):
    __tablename__ = "learning_pathways"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    overview = Column(Text, nullable=True)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    estimated_duration = Column(String(100), nullable=True)  # e.g., "3 months", "40 hours"
    
    # Metadata
    category = Column(String(100), nullable=True)
    tags = Column(JSON, nullable=True)
    prerequisites = Column(JSON, nullable=True)
    learning_outcomes = Column(JSON, nullable=True)
    
    # Visual elements
    thumbnail = Column(String(500), nullable=True)
    banner_image = Column(String(500), nullable=True)
    icon = Column(String(100), nullable=True)
    color_scheme = Column(String(50), nullable=True)
    
    # Status and metrics
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    total_enrollments = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    completion_rate = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    courses = relationship("Course", secondary=pathway_courses, back_populates="pathways")
    enrolled_users = relationship("User", secondary=user_pathways, back_populates="pathways")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    duration = Column(String(100), nullable=True)  # e.g., "2 hours", "5 weeks"
    
    # Content and structure
    syllabus = Column(JSON, nullable=True)  # Course modules and lessons
    learning_objectives = Column(JSON, nullable=True)
    prerequisites = Column(JSON, nullable=True)
    
    # Instructor information
    instructor_name = Column(String(200), nullable=True)
    instructor_bio = Column(Text, nullable=True)
    instructor_avatar = Column(String(500), nullable=True)
    instructor_credentials = Column(JSON, nullable=True)
    
    # Media and resources
    thumbnail = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    video_duration = Column(Integer, nullable=True)  # in seconds
    materials = Column(JSON, nullable=True)  # Additional resources
    
    # Pricing and access
    price = Column(Float, default=0.0)
    is_free = Column(Boolean, default=True)
    access_level = Column(String(50), default="public")  # public, premium, restricted
    
    # Metrics and status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    total_enrollments = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    total_lessons = Column(Integer, default=0)
    total_quizzes = Column(Integer, default=0)
    total_assignments = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    pathways = relationship("LearningPathway", secondary=pathway_courses, back_populates="courses")
    enrolled_users = relationship("User", secondary=user_courses, back_populates="courses")
    skills = relationship("Skill", secondary=course_skills, back_populates="courses")
    quizzes = relationship("Quiz", back_populates="course")
    progress_records = relationship("ProgressRecord", back_populates="course")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    # Quiz configuration
    time_limit = Column(Integer, nullable=True)  # in seconds
    passing_score = Column(Float, default=60.0)
    max_attempts = Column(Integer, default=3)
    shuffle_questions = Column(Boolean, default=True)
    show_results = Column(Boolean, default=True)
    
    # Content
    questions = Column(JSON, nullable=False)  # Quiz questions and answers
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="quizzes")
    attempts = relationship("QuizAttempt", back_populates="quiz")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    
    # Attempt data
    answers = Column(JSON, nullable=False)  # User's answers
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    time_taken = Column(Integer, nullable=True)  # in seconds
    
    # Status
    is_passed = Column(Boolean, default=False)
    attempt_number = Column(Integer, default=1)
    started_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    rarity = Column(String(50), default="common")  # common, uncommon, rare, epic, legendary
    
    # Criteria
    criteria = Column(JSON, nullable=False)  # Achievement requirements
    points = Column(Integer, default=0)
    xp_reward = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    users = relationship("User", secondary=user_achievements, back_populates="achievements")

class ProgressRecord(Base):
    __tablename__ = "progress_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    # Progress data
    current_lesson = Column(String(200), nullable=True)
    progress_percentage = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0)  # in minutes
    last_accessed = Column(DateTime, default=func.now())
    
    # Completion data
    completed_lessons = Column(JSON, nullable=True)
    completed_quizzes = Column(JSON, nullable=True)
    completed_assignments = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    bookmarks = Column(JSON, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="progress_records")
    course = relationship("Course", back_populates="progress_records")

class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    pathway_id = Column(Integer, ForeignKey("learning_pathways.id"), nullable=True)
    
    # Certificate details
    certificate_id = Column(String(100), unique=True, nullable=False)  # Public certificate ID
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    completion_date = Column(DateTime, default=func.now())
    
    # Validation
    final_score = Column(Float, nullable=True)
    skills_acquired = Column(JSON, nullable=True)
    verification_code = Column(String(100), unique=True, nullable=False)
    
    # Status
    is_valid = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="certificates")

class LearningAnalytics(Base):
    __tablename__ = "learning_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Daily metrics
    date = Column(DateTime, default=func.now())
    time_spent = Column(Integer, default=0)  # minutes
    lessons_completed = Column(Integer, default=0)
    quizzes_taken = Column(Integer, default=0)
    assignments_submitted = Column(Integer, default=0)
    
    # Engagement metrics
    login_count = Column(Integer, default=0)
    interaction_score = Column(Float, default=0.0)
    learning_velocity = Column(Float, default=0.0)
    
    # Performance metrics
    average_quiz_score = Column(Float, default=0.0)
    improvement_rate = Column(Float, default=0.0)
    skill_progress = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=func.now())