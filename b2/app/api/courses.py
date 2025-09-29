from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from app.core.database import get_db
from app.core.security import (
    get_current_user, 
    get_current_instructor_user,
    get_current_admin_user,
    SECURITY_HEADERS
)
from app.models.database import User, Course, Skill, Quiz, user_courses
from app.models.schemas import (
    CourseResponse, 
    CourseCreate, 
    CourseUpdate,
    CourseDetail,
    PaginatedResponse,
    CourseEnrollment
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=PaginatedResponse[CourseResponse])
async def list_courses(
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    skill_id: Optional[int] = Query(None),
    instructor_id: Optional[int] = Query(None),
    is_published: Optional[bool] = Query(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List courses with filtering and pagination"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    query = db.query(Course)
    
    # For non-admin users, only show published courses
    if not current_user or current_user.role.value != "admin":
        query = query.filter(Course.is_published == True)
    elif is_published is not None:
        query = query.filter(Course.is_published == is_published)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Course.title.ilike(search_term),
                Course.description.ilike(search_term),
                Course.category.ilike(search_term)
            )
        )
    
    if category:
        query = query.filter(Course.category.ilike(f"%{category}%"))
    
    if difficulty:
        query = query.filter(Course.difficulty_level == difficulty)
    
    if skill_id:
        query = query.join(Course.required_skills).filter(Skill.id == skill_id)
    
    if instructor_id:
        query = query.filter(Course.instructor_id == instructor_id)
    
    # Get total count
    total = query.count()
    
    # Apply pagination and load related data
    courses = query.options(
        selectinload(Course.instructor),
        selectinload(Course.required_skills)
    ).offset(skip).limit(limit).all()
    
    logger.info(f"Listed {len(courses)} courses with filters")
    
    return PaginatedResponse(
        items=[CourseResponse.from_orm(course) for course in courses],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    response: Response,
    course_data: CourseCreate,
    current_user: User = Depends(get_current_instructor_user),
    db: Session = Depends(get_db)
):
    """Create a new course (instructor/admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Create course
    course = Course(
        title=course_data.title,
        description=course_data.description,
        category=course_data.category,
        difficulty_level=course_data.difficulty_level,
        estimated_hours=course_data.estimated_hours,
        content=course_data.content,
        instructor_id=current_user.id,
        is_published=course_data.is_published if current_user.role.value == "admin" else False
    )
    
    db.add(course)
    db.commit()
    db.refresh(course)
    
    # Add required skills if provided
    if course_data.required_skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(course_data.required_skill_ids)).all()
        course.required_skills.extend(skills)
        db.commit()
    
    logger.info(f"Course created: {course.title} by {current_user.username}")
    
    return CourseResponse.from_orm(course)

@router.get("/{course_id}", response_model=CourseDetail)
async def get_course(
    course_id: int,
    response: Response,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get course details"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).options(
        selectinload(Course.instructor),
        selectinload(Course.required_skills),
        selectinload(Course.quizzes),
        selectinload(Course.enrolled_students)
    ).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if user can access unpublished course
    if not course.is_published:
        if not current_user or (
            current_user.role.value not in ["admin", "instructor"] and 
            course.instructor_id != current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Course not available"
            )
    
    # Check if user is enrolled
    is_enrolled = False
    if current_user:
        is_enrolled = current_user in course.enrolled_students
    
    course_detail = CourseDetail.from_orm(course)
    course_detail.is_enrolled = is_enrolled
    course_detail.enrollment_count = len(course.enrolled_students)
    
    return course_detail

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_update: CourseUpdate,
    response: Response,
    current_user: User = Depends(get_current_instructor_user),
    db: Session = Depends(get_db)
):
    """Update course (instructor/admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    if current_user.role.value != "admin" and course.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this course"
        )
    
    # Update fields
    for field, value in course_update.dict(exclude_unset=True).items():
        if field == "required_skill_ids":
            if value is not None:
                skills = db.query(Skill).filter(Skill.id.in_(value)).all()
                course.required_skills.clear()
                course.required_skills.extend(skills)
        elif field == "is_published":
            # Only admin can publish/unpublish
            if current_user.role.value == "admin":
                setattr(course, field, value)
        else:
            setattr(course, field, value)
    
    db.commit()
    db.refresh(course)
    
    logger.info(f"Course updated: {course.title} by {current_user.username}")
    
    return CourseResponse.from_orm(course)

@router.delete("/{course_id}")
async def delete_course(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_instructor_user),
    db: Session = Depends(get_db)
):
    """Delete course (instructor/admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    if current_user.role.value != "admin" and course.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this course"
        )
    
    # Check if course has enrollments
    if course.enrolled_students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete course with enrolled students"
        )
    
    course_title = course.title
    db.delete(course)
    db.commit()
    
    logger.info(f"Course deleted: {course_title} by {current_user.username}")
    
    return {"message": f"Course '{course_title}' has been deleted"}

@router.post("/{course_id}/enroll")
async def enroll_in_course(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll current user in course"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if not course.is_published:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course is not available for enrollment"
        )
    
    # Check if already enrolled
    if current_user in course.enrolled_students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    # Check prerequisite skills if any
    if course.required_skills:
        user_skills = {skill.name.lower() for skill in current_user.skills}
        required_skills = {skill.name.lower() for skill in course.required_skills}
        missing_skills = required_skills - user_skills
        
        if missing_skills:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required skills: {', '.join(missing_skills)}"
            )
    
    # Enroll user
    course.enrolled_students.append(current_user)
    db.commit()
    
    logger.info(f"User {current_user.username} enrolled in course {course.title}")
    
    return {"message": f"Successfully enrolled in '{course.title}'"}

@router.delete("/{course_id}/enroll")
async def unenroll_from_course(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unenroll current user from course"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if enrolled
    if current_user not in course.enrolled_students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enrolled in this course"
        )
    
    # Unenroll user
    course.enrolled_students.remove(current_user)
    db.commit()
    
    logger.info(f"User {current_user.username} unenrolled from course {course.title}")
    
    return {"message": f"Successfully unenrolled from '{course.title}'"}

@router.get("/{course_id}/students", response_model=List[dict])
async def get_course_students(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_instructor_user),
    db: Session = Depends(get_db)
):
    """Get list of students enrolled in course (instructor/admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).options(
        selectinload(Course.enrolled_students)
    ).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    if current_user.role.value != "admin" and course.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view course students"
        )
    
    students = []
    for student in course.enrolled_students:
        students.append({
            "id": student.id,
            "username": student.username,
            "full_name": student.full_name,
            "email": student.email,
            "enrolled_date": student.created_at.isoformat() if student.created_at else None,
            "level": student.level,
            "xp_points": student.xp_points
        })
    
    logger.info(f"Retrieved {len(students)} students for course {course.title}")
    
    return students

@router.post("/{course_id}/publish")
async def publish_course(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Publish course (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course.is_published = True
    db.commit()
    
    logger.info(f"Course published: {course.title} by {current_user.username}")
    
    return {"message": f"Course '{course.title}' has been published"}

@router.post("/{course_id}/unpublish")
async def unpublish_course(
    course_id: int,
    response: Response,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Unpublish course (admin only)"""
    # Add security headers
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course.is_published = False
    db.commit()
    
    logger.info(f"Course unpublished: {course.title} by {current_user.username}")
    
    return {"message": f"Course '{course.title}' has been unpublished"}