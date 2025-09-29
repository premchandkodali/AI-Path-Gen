from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.database import User

router = APIRouter()

# Interactive modules will be loaded from database
SAMPLE_MODULES = []

@router.get("/interactive-modules")
async def get_interactive_modules(
    category: str = None,
    difficulty: str = None,
    type: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all interactive modules with optional filtering"""
    try:
        modules = SAMPLE_MODULES.copy()
        
        # Apply filters
        if category and category != "All":
            modules = [m for m in modules if m["category"] == category]
        
        if difficulty:
            modules = [m for m in modules if m["difficulty"] == difficulty]
            
        if type:
            modules = [m for m in modules if m["type"] == type]
        
        return {
            "success": True,
            "data": modules,
            "total": len(modules)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch interactive modules"
        )

@router.get("/interactive-modules/{module_id}")
async def get_interactive_module(
    module_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific interactive module by ID"""
    try:
        module = next((m for m in SAMPLE_MODULES if m["id"] == module_id), None)
        
        if not module:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interactive module not found"
            )
        
        return {
            "success": True,
            "data": module
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch interactive module"
        )

@router.post("/interactive-modules/{module_id}/start")
async def start_interactive_module(
    module_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start an interactive module session"""
    try:
        module = next((m for m in SAMPLE_MODULES if m["id"] == module_id), None)
        
        if not module:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interactive module not found"
            )
        
        # Here you would typically create a session record in the database
        session_data = {
            "session_id": f"session_{current_user.id}_{module_id}",
            "module_id": module_id,
            "user_id": current_user.id,
            "started_at": "2025-09-30T10:00:00Z",
            "status": "active"
        }
        
        return {
            "success": True,
            "data": session_data,
            "module": module
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start interactive module"
        )

@router.post("/interactive-modules/{module_id}/complete")
async def complete_interactive_module(
    module_id: int,
    session_id: str,
    score: int,
    time_spent: int,  # in minutes
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete an interactive module and record results"""
    try:
        module = next((m for m in SAMPLE_MODULES if m["id"] == module_id), None)
        
        if not module:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interactive module not found"
            )
        
        # Here you would typically save the completion data to the database
        completion_data = {
            "session_id": session_id,
            "module_id": module_id,
            "user_id": current_user.id,
            "score": score,
            "time_spent": time_spent,
            "completed_at": "2025-09-30T10:30:00Z",
            "status": "completed"
        }
        
        return {
            "success": True,
            "data": completion_data,
            "message": "Module completed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete interactive module"
        )