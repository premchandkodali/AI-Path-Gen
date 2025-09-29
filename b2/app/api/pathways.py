from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.recommendation_engine import recommend_pathway as ai_recommend_pathway, merge_courses_for_custom_pathway, fetch_external_courses
from app.core.database import get_db
from fastapi import Depends

router = APIRouter()

# Input schema for recommendation request
class PathwayRequest(BaseModel):
    user_id: int
    profile: dict  # Should match UserProfile fields

# Output schema for recommended pathway
class PathwayRecommendation(BaseModel):
    recommended_courses: List[str]
    recommended_certifications: List[str]
    recommended_on_job_training: List[str]
    labour_market_info: dict
    custom_pathway: Optional[dict] = None
    external_courses: Optional[list] = None
    notes: Optional[str] = None

@router.post("/recommend", response_model=PathwayRecommendation)
def recommend_pathway(request: PathwayRequest, db=Depends(get_db)):
    profile = request.profile
    ai_result = ai_recommend_pathway(profile)
    requested_title = profile.get("requested_course", "")
    custom_pathway = None
    external_courses = None
    if requested_title:
        custom_pathway = merge_courses_for_custom_pathway(requested_title, db)
        external_courses = fetch_external_courses(requested_title)
    return PathwayRecommendation(
        recommended_courses=ai_result["recommended_courses"],
        recommended_certifications=ai_result["recommended_certifications"],
        recommended_on_job_training=ai_result["recommended_on_job_training"],
        labour_market_info=ai_result["labour_market_info"],
        custom_pathway=custom_pathway,
        external_courses=external_courses,
        notes="AI-powered recommendation based on your profile."
    )
