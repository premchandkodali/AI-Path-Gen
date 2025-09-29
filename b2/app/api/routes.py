from fastapi import APIRouter
from app.api import auth, users, pathways

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(pathways.router, prefix="/pathways", tags=["learning-pathways"])