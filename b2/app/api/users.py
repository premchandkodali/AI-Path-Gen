from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session, selectinload
from app.core.database import get_db
from app.core.security import (
    get_current_user, 
    get_current_admin_user,
    get_password_hash,
    validate_password,
    SECURITY_HEADERS
)
from app.models.database import User, Course, LearningPathway, QuizAttempt, Achievement
from app.models.schemas import (
    UserResponse, 
    UserCreate, 
    UserUpdate,
    UserProfile,
    UserProgressSummary,
    PaginatedUserResponse
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=PaginatedUserResponse)
async def list_users(
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    query = db.query(User)
    
    # Filter by role if specified
    if role:
        query = query.filter(User.role == role)
    
    # Search by username, email, or full name
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.username.ilike(search_term)) |
            (User.email.ilike(search_term)) |
            (User.full_name.ilike(search_term))
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    users = query.offset(skip).limit(limit).all()
    
    logger.info(f"Admin {current_user.username} listed users: {len(users)} results")
    
    return PaginatedUserResponse(
        items=[UserResponse.from_orm(user) for user in users],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/me", response_model=UserProfile)
async def get_my_profile(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's detailed profile"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Load user with related data
    user = db.query(User).options(
        selectinload(User.enrolled_courses),
        selectinload(User.enrolled_pathways),
        selectinload(User.achievements),
        selectinload(User.quiz_attempts)
    ).filter(User.id == current_user.id).first()
    
    return UserProfile.from_orm(user)

@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    response: Response,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Update allowed fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if field == "password":
            if not validate_password(value):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password does not meet requirements"
                )
            setattr(current_user, "hashed_password", get_password_hash(value))
        elif field in ["full_name", "bio", "skills", "preferences"]:
            setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)

    logger.info(f"User {current_user.username} updated their profile")

    # --- Real-time recommendation re-evaluation ---
    from app.services.recommendation_engine import recommend_pathway
    profile_dict = current_user.__dict__.copy()
    # Add any additional fields needed for recommendation
    profile_dict["db"] = db
    recommendations = recommend_pathway(profile_dict)
    # Optionally, store recommendations in user profile or return as part of response

    return {
        "user": UserResponse.from_orm(current_user),
        "recommendations": recommendations
    }

@router.get("/me/progress", response_model=UserProgressSummary)
async def get_my_progress(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's learning progress summary"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Calculate progress statistics
    enrolled_courses_count = len(current_user.enrolled_courses)
    completed_courses = sum(1 for course in current_user.enrolled_courses if course.is_completed)
    
    enrolled_pathways_count = len(current_user.enrolled_pathways)
    active_pathways = sum(1 for pathway in current_user.enrolled_pathways if not pathway.is_completed)
    
    quiz_attempts_count = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).count()
    
    achievements_count = len(current_user.achievements)
    
    # Calculate average score
    quiz_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.is_completed == True
    ).all()
    
    average_score = 0
    if quiz_attempts:
        total_score = sum(attempt.score for attempt in quiz_attempts)
        average_score = total_score / len(quiz_attempts)
    
    return UserProgressSummary(
        user_id=current_user.id,
        total_xp=current_user.xp_points,
        level=current_user.level,
        enrolled_courses=enrolled_courses_count,
        completed_courses=completed_courses,
        enrolled_pathways=enrolled_pathways_count,
        active_pathways=active_pathways,
        quiz_attempts=quiz_attempts_count,
        achievements=achievements_count,
        average_score=round(average_score, 2),
        learning_streak=current_user.learning_streak_days
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get user by ID (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    logger.info(f"Admin {current_user.username} accessed user {user.username}")
    return UserResponse.from_orm(user)

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update user by ID (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if field == "password":
            if not validate_password(value):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password does not meet requirements"
                )
            setattr(user, "hashed_password", get_password_hash(value))
        else:
            setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    logger.info(f"Admin {current_user.username} updated user {user.username}")
    
    return UserResponse.from_orm(user)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user by ID (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    username = user.username
    db.delete(user)
    db.commit()
    
    logger.info(f"Admin {current_user.username} deleted user {username}")
    
    return {"message": f"User {username} has been deleted"}

@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Activate user account (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = True
    db.commit()
    
    logger.info(f"Admin {current_user.username} activated user {user.username}")
    enrolled_courses_count = len(user.courses)
    completed_courses = sum(1 for course in user.courses if getattr(course, 'is_completed', False))
    enrolled_pathways_count = len(user.pathways)
    active_pathways = sum(1 for pathway in user.pathways if not getattr(pathway, 'is_completed', False))
async def deactivate_user(
    user_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Deactivate user account (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )
    
    user.is_active = False
    db.commit()
    
    logger.info(f"Admin {current_user.username} deactivated user {user.username}")
    
    return {"message": f"User {user.username} has been deactivated"}

@router.get("/{user_id}/progress", response_model=UserProgressSummary)
async def get_user_progress(
    user_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get user's progress summary (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Calculate progress (similar to get_my_progress)
    enrolled_courses_count = len(user.enrolled_courses)
    completed_courses = sum(1 for course in user.enrolled_courses if course.is_completed)
    
    enrolled_pathways_count = len(user.enrolled_pathways)
    active_pathways = sum(1 for pathway in user.enrolled_pathways if not pathway.is_completed)
    
    quiz_attempts_count = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id
    ).count()
    
    achievements_count = len(user.achievements)
    
    quiz_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id,
        QuizAttempt.is_completed == True
    ).all()
    
    average_score = 0
    if quiz_attempts:
        total_score = sum(attempt.score for attempt in quiz_attempts)
        average_score = total_score / len(quiz_attempts)
    
    logger.info(f"Admin {current_user.username} accessed progress for user {user.username}")
    
    return UserProgressSummary(
        user_id=user.id,
        total_xp=user.xp_points,
        level=user.level,
        enrolled_courses=enrolled_courses_count,
        completed_courses=completed_courses,
        enrolled_pathways=enrolled_pathways_count,
        active_pathways=active_pathways,
        quiz_attempts=quiz_attempts_count,
        achievements=achievements_count,
        average_score=round(average_score, 2),
        learning_streak=user.learning_streak_days
    )