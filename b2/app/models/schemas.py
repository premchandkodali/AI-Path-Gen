# UserProgressSummary schema for API responses
# Place at the end of the file after all dependencies
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any, Union, Generic, TypeVar
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    POLICYMAKER = "policymaker"
    ADMIN = "admin"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTIPLE_SELECT = "multiple_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    CODE_COMPLETION = "code_completion"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# UserResponse schema for API responses
class UserResponse(BaseSchema):
    id: int
    email: EmailStr
    username: str
    role: UserRole
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    location: Optional[str] = None
    learning_style: Optional[str] = None
    preferred_difficulty: Optional[DifficultyLevel] = None
    time_commitment: Optional[str] = None
    goals: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    total_xp: int
    level: int
    total_points: int
    current_streak: int
    longest_streak: int

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    POLICYMAKER = "policymaker"
    ADMIN = "admin"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTIPLE_SELECT = "multiple_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    CODE_COMPLETION = "code_completion"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# Email verification schema
class EmailVerification(BaseSchema):
    email: EmailStr
    token: str
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTIPLE_SELECT = "multiple_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    CODE_COMPLETION = "code_completion"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# Email verification schema
class EmailVerification(BaseSchema):
    email: EmailStr
    token: str

# Password reset schemas
class PasswordResetRequest(BaseSchema):
    email: EmailStr

class PasswordResetConfirm(BaseSchema):
    token: str
    new_password: str
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTIPLE_SELECT = "multiple_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    CODE_COMPLETION = "code_completion"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# Password reset schemas
class PasswordResetRequest(BaseSchema):
    email: EmailStr

class PasswordResetConfirm(BaseSchema):
    token: str
    new_password: str

# User schemas
class UserBase(BaseSchema):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    role: UserRole = UserRole.STUDENT

class UserUpdate(BaseSchema):
    bio: Optional[str] = None
    location: Optional[str] = None
    learning_style: Optional[str] = None
    preferred_difficulty: Optional[DifficultyLevel] = None
    time_commitment: Optional[str] = None
    goals: Optional[List[str]] = None
    interests: Optional[List[str]] = None

class UserProfile(BaseSchema):
    id: int
    email: EmailStr
    username: str
    role: UserRole
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    location: Optional[str] = None
    learning_style: Optional[str] = None
    preferred_difficulty: Optional[DifficultyLevel] = None
    time_commitment: Optional[str] = None
    goals: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    # New fields for AI learner profiling
    socio_economic_context: Optional[Dict[str, Any]] = None  # e.g., {"income_bracket": "low", "education_level": "UG", "employment_status": "unemployed"}
    prior_skills: Optional[List[str]] = None  # List of skill names or IDs
    career_aspirations: Optional[str] = None  # Free text or structured aspiration
    learning_pace: Optional[str] = None  # e.g., "fast", "moderate", "slow"
    digital_access: Optional[str] = None  # e.g., "high", "medium", "low"
    is_active: bool
    is_verified: bool
    created_at: datetime
    total_xp: int
    level: int
    total_points: int
    current_streak: int
    longest_streak: int

class UserPublic(BaseSchema):
    id: int
    username: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    level: int
    total_points: int

# Authentication schemas
class Token(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserProfile

class TokenData(BaseSchema):
    username: Optional[str] = None

class LoginRequest(BaseSchema):
    username: str
    password: str

# Skill schemas
class SkillBase(BaseSchema):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    nsqf_level: Optional[int] = Field(None, ge=1, le=10)

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int

# Course schemas
class CourseBase(BaseSchema):
    title: str = Field(..., max_length=300)
    description: str
    short_description: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    duration: Optional[str] = None

class CourseCreate(CourseBase):
    syllabus: Optional[List[Dict[str, Any]]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    instructor_name: Optional[str] = None
    instructor_bio: Optional[str] = None
    skills: Optional[List[int]] = None  # Skill IDs

class CourseUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    duration: Optional[str] = None
    syllabus: Optional[List[Dict[str, Any]]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None

class Course(CourseBase):
    id: int
    syllabus: Optional[List[Dict[str, Any]]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    instructor_name: Optional[str] = None
    instructor_bio: Optional[str] = None
    instructor_avatar: Optional[str] = None
    instructor_credentials: Optional[List[Dict[str, Any]]] = None
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    video_duration: Optional[int] = None
    materials: Optional[List[Dict[str, Any]]] = None
    price: float
    is_free: bool
    is_active: bool
    is_featured: bool
    total_enrollments: int
    average_rating: float
    total_lessons: int
    total_quizzes: int
    total_assignments: int
    created_at: datetime
    updated_at: datetime
    skills: List[Skill] = []

class CourseResponse(CourseBase):
    id: int
    syllabus: Optional[List[Dict[str, Any]]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    instructor_name: Optional[str] = None
    instructor_bio: Optional[str] = None
    instructor_avatar: Optional[str] = None
    instructor_credentials: Optional[List[Dict[str, Any]]] = None
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    video_duration: Optional[int] = None
    materials: Optional[List[Dict[str, Any]]] = None
    price: float
    is_free: bool
    is_active: bool
    is_featured: bool
    total_enrollments: int
    average_rating: float
    total_lessons: int
    total_quizzes: int
    total_assignments: int
    created_at: datetime
    updated_at: datetime
    skills: List[Skill] = []

class CourseDetail(CourseBase):
    id: int
    syllabus: Optional[List[Dict[str, Any]]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    instructor_name: Optional[str] = None
    instructor_bio: Optional[str] = None
    instructor_avatar: Optional[str] = None
    instructor_credentials: Optional[List[Dict[str, Any]]] = None
    thumbnail: Optional[str] = None
    video_url: Optional[str] = None
    video_duration: Optional[int] = None
    materials: Optional[List[Dict[str, Any]]] = None
    price: float
    is_free: bool
    is_active: bool
    is_featured: bool
    total_enrollments: int
    average_rating: float
    total_lessons: int
    total_quizzes: int
    total_assignments: int
    created_at: datetime
    updated_at: datetime
    skills: List[Skill] = []

class CourseProgress(BaseSchema):
    course_id: int
    progress_percentage: float
    time_spent: int
    current_lesson: Optional[str] = None
    completed_lessons: Optional[List[str]] = None
    completed_quizzes: Optional[List[str]] = None
    completed_assignments: Optional[List[str]] = None
    last_accessed: datetime

class CourseEnrollment(BaseSchema):
    course_id: int
    enrolled_at: datetime
    progress: float
    last_accessed: datetime

# Learning Pathway schemas
class LearningPathwayBase(BaseSchema):
    title: str = Field(..., max_length=300)
    description: str
    overview: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    estimated_duration: Optional[str] = None

class LearningPathwayCreate(LearningPathwayBase):
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    learning_outcomes: Optional[List[str]] = None
    course_ids: Optional[List[int]] = None

class LearningPathwayUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    overview: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    estimated_duration: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    learning_outcomes: Optional[List[str]] = None

class LearningPathway(LearningPathwayBase):
    id: int
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    learning_outcomes: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    banner_image: Optional[str] = None
    icon: Optional[str] = None
    color_scheme: Optional[str] = None
    is_active: bool
    is_featured: bool
    total_enrollments: int
    average_rating: float
    completion_rate: float
    created_at: datetime
    updated_at: datetime
    courses: List[Course] = []

class PathwayProgress(BaseSchema):
    pathway_id: int
    progress_percentage: float
    enrolled_at: datetime
    completed_courses: List[int] = []
    current_course_id: Optional[int] = None

# Quiz schemas
class QuizQuestionBase(BaseSchema):
    id: Optional[int] = None
    type: QuestionType
    question: str
    description: Optional[str] = None
    options: List[str]
    points: int = Field(default=10, ge=1)

class QuizQuestionMultipleChoice(QuizQuestionBase):
    type: QuestionType = QuestionType.MULTIPLE_CHOICE
    correct_answer: int = Field(..., ge=0)

class QuizQuestionMultipleSelect(QuizQuestionBase):
    type: QuestionType = QuestionType.MULTIPLE_SELECT
    correct_answers: List[int]

class QuizQuestionTrueFalse(QuizQuestionBase):
    type: QuestionType = QuestionType.TRUE_FALSE
    correct_answer: int = Field(..., ge=0, le=1)

class QuizQuestionFillBlank(QuizQuestionBase):
    type: QuestionType = QuestionType.FILL_BLANK
    correct_answers: List[str]
    text_with_blanks: str

class QuizQuestionCodeCompletion(QuizQuestionBase):
    type: QuestionType = QuestionType.CODE_COMPLETION
    code_template: Optional[str] = None
    expected_keywords: Optional[List[str]] = None
    hint: Optional[str] = None

QuizQuestion = Union[
    QuizQuestionMultipleChoice,
    QuizQuestionMultipleSelect,
    QuizQuestionTrueFalse,
    QuizQuestionFillBlank,
    QuizQuestionCodeCompletion
]

class QuizBase(BaseSchema):
    title: str = Field(..., max_length=300)
    description: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: float = Field(default=60.0, ge=0, le=100)
    max_attempts: int = Field(default=3, ge=1)

class QuizCreate(QuizBase):
    course_id: int
    questions: List[Dict[str, Any]]

class Quiz(QuizBase):
    id: int
    course_id: int
    questions: List[Dict[str, Any]]
    shuffle_questions: bool
    show_results: bool
    is_active: bool
    created_at: datetime

class QuizAttemptCreate(BaseSchema):
    quiz_id: int
    answers: Dict[str, Any]

class QuizAttempt(BaseSchema):
    id: int
    user_id: int
    quiz_id: int
    answers: Dict[str, Any]
    score: float
    max_score: float
    percentage: float
    time_taken: Optional[int] = None
    is_passed: bool
    attempt_number: int
    started_at: datetime
    completed_at: Optional[datetime] = None

class QuizResults(BaseSchema):
    attempt: QuizAttempt
    correct_answers: Dict[str, Any]
    question_analysis: List[Dict[str, Any]]
    recommendations: Optional[List[str]] = None

# Achievement schemas
class AchievementBase(BaseSchema):
    name: str = Field(..., max_length=200)
    description: str
    icon: Optional[str] = None
    category: Optional[str] = None
    rarity: str = Field(default="common")

class AchievementCreate(AchievementBase):
    criteria: Dict[str, Any]
    points: int = Field(default=0, ge=0)
    xp_reward: int = Field(default=0, ge=0)

class Achievement(AchievementBase):
    id: int
    criteria: Dict[str, Any]
    points: int
    xp_reward: int
    is_active: bool
    created_at: datetime

class UserAchievement(BaseSchema):
    achievement: Achievement
    earned_at: datetime

# Progress and Analytics schemas
class ProgressRecordUpdate(BaseSchema):
    current_lesson: Optional[str] = None
    progress_percentage: Optional[float] = Field(None, ge=0, le=100)
    time_spent: Optional[int] = Field(None, ge=0)  # minutes
    completed_lessons: Optional[List[str]] = None
    completed_quizzes: Optional[List[str]] = None
    completed_assignments: Optional[List[str]] = None
    notes: Optional[str] = None
    bookmarks: Optional[List[Dict[str, Any]]] = None

class ProgressRecord(BaseSchema):
    id: int
    user_id: int
    course_id: int
    current_lesson: Optional[str] = None
    progress_percentage: float
    time_spent: int
    last_accessed: datetime
    completed_lessons: Optional[List[str]] = None
    completed_quizzes: Optional[List[str]] = None
    completed_assignments: Optional[List[str]] = None
    notes: Optional[str] = None
    bookmarks: Optional[List[Dict[str, Any]]] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

class LearningAnalytics(BaseSchema):
    id: int
    user_id: int
    date: datetime
    time_spent: int
    lessons_completed: int
    quizzes_taken: int
    assignments_submitted: int
    login_count: int
    interaction_score: float
    learning_velocity: float
    average_quiz_score: float
    improvement_rate: float
    skill_progress: Optional[Dict[str, Any]] = None

class UserStatistics(BaseSchema):
    total_courses_enrolled: int
    total_courses_completed: int
    total_pathways_enrolled: int
    total_pathways_completed: int
    total_time_spent: int  # minutes
    average_quiz_score: float
    total_achievements: int
    current_level: int
    total_xp: int
    current_streak: int
    longest_streak: int
    courses_in_progress: List[CourseProgress]
    recent_achievements: List[UserAchievement]
    weekly_activity: List[LearningAnalytics]

# Certificate schemas
class CertificateCreate(BaseSchema):
    user_id: int
    course_id: Optional[int] = None
    pathway_id: Optional[int] = None
    title: str
    final_score: Optional[float] = None
    skills_acquired: Optional[List[str]] = None

class Certificate(BaseSchema):
    id: int
    user_id: int
    course_id: Optional[int] = None
    pathway_id: Optional[int] = None
    certificate_id: str
    title: str
    description: Optional[str] = None
    completion_date: datetime
    final_score: Optional[float] = None
    skills_acquired: Optional[List[str]] = None
    verification_code: str
    is_valid: bool
    created_at: datetime

# Search and filter schemas
class CourseFilter(BaseSchema):
    category: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    is_free: Optional[bool] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    duration_max: Optional[int] = None  # in hours
    skills: Optional[List[str]] = None
    search: Optional[str] = None

class PathwayFilter(BaseSchema):
    category: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    duration_max: Optional[int] = None  # in weeks
    search: Optional[str] = None

class PaginationParams(BaseSchema):
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)

class SortParams(BaseSchema):
    sort_by: str = "created_at"
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")

# API Response schemas
class APIResponse(BaseSchema):
    success: bool
    message: str
    data: Optional[Any] = None

class PaginatedUserResponse(BaseSchema):
    items: List[UserResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool

T = TypeVar("T")

class PaginatedResponse(BaseSchema, Generic[T]):
    items: List[T]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool

# Recommendation schemas
class RecommendationRequest(BaseSchema):
    user_id: int
    recommendation_type: str = "course"  # course, pathway, skill
    limit: int = Field(default=10, ge=1, le=50)
    context: Optional[Dict[str, Any]] = None

class Recommendation(BaseSchema):
    item_id: int
    item_type: str
    title: str
    description: str
    confidence_score: float = Field(..., ge=0, le=1)
    reasoning: List[str]
    thumbnail: Optional[str] = None

# UserProgressSummary schema for API responses
class UserProgressSummary(BaseSchema):
    user_id: int
    courses_in_progress: List[CourseProgress]
    recent_achievements: List[UserAchievement]
    weekly_activity: List[LearningAnalytics]
    total_courses_enrolled: int
    total_courses_completed: int
    total_pathways_enrolled: int
    total_pathways_completed: int
    total_time_spent: int  # minutes
    average_quiz_score: float
    total_achievements: int
    current_level: int
    total_xp: int
    current_streak: int
    longest_streak: int