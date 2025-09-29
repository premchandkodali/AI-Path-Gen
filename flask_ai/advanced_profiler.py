"""
Advanced AI-Powered Learner Profiling Engine
Comprehensive learner analysis for personalized pathway generation
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import logging
from enum import Enum

logger = logging.getLogger(__name__)

class LearningStyle(Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING_WRITING = "reading_writing"

class IncomeCategory(Enum):
    BELOW_POVERTY_LINE = "bpl"
    LOW_INCOME = "low"
    MIDDLE_INCOME = "middle"
    HIGH_INCOME = "high"

class EducationLevel(Enum):
    NO_FORMAL_EDUCATION = "none"
    PRIMARY = "primary"
    SECONDARY = "secondary"
    HIGHER_SECONDARY = "higher_secondary"
    UNDERGRADUATE = "undergraduate"
    POSTGRADUATE = "postgraduate"
    DOCTORATE = "doctorate"

class EmploymentStatus(Enum):
    UNEMPLOYED = "unemployed"
    STUDENT = "student"
    EMPLOYED_FORMAL = "employed_formal"
    EMPLOYED_INFORMAL = "employed_informal"
    SELF_EMPLOYED = "self_employed"
    RETIRED = "retired"

@dataclass
class SocioEconomicProfile:
    """Comprehensive socio-economic context"""
    income_category: IncomeCategory
    family_monthly_income: Optional[float]
    family_size: int
    education_level: EducationLevel
    employment_status: EmploymentStatus
    geographic_location: Dict[str, str]  # state, district, urban/rural
    digital_device_access: List[str]  # smartphone, laptop, tablet
    internet_connectivity: str  # high_speed, low_speed, intermittent, none
    primary_language: str
    additional_languages: List[str]
    physical_accessibility_needs: List[str]
    transportation_constraints: bool
    family_support_for_learning: str  # high, medium, low

@dataclass
class PsychometricProfile:
    """Learning style and cognitive assessment"""
    learning_style: LearningStyle
    attention_span_minutes: int
    problem_solving_approach: str  # analytical, intuitive, systematic, creative
    stress_tolerance: str  # high, medium, low
    social_learning_preference: str  # group, individual, mixed
    risk_tolerance: str  # high, medium, low
    motivation_factors: List[str]  # financial, personal_growth, family, recognition
    preferred_feedback_style: str  # immediate, periodic, milestone_based
    technology_comfort_level: str  # expert, intermediate, beginner, novice

@dataclass
class AccessibilityProfile:
    """Accessibility and inclusion requirements"""
    visual_impairment: Optional[str]  # none, partial, complete
    hearing_impairment: Optional[str]  # none, partial, complete
    motor_impairment: Optional[str]  # none, mild, moderate, severe
    cognitive_considerations: List[str]  # dyslexia, ADHD, autism, etc.
    assistive_technology_used: List[str]
    content_format_preferences: List[str]  # text, audio, video, interactive
    language_support_needed: bool
    cultural_considerations: List[str]

class AdvancedLearnerProfiler:
    """
    Advanced AI-powered learner profiling engine for comprehensive analysis
    """
    
    def __init__(self):
        self.skill_demand_data = self._load_skill_demand_data()
        self.regional_employment_data = self._load_regional_data()
        self.industry_growth_predictions = self._load_industry_predictions()
    
    def _load_skill_demand_data(self) -> Dict[str, Any]:
        """Load real-time skill demand data"""
        # In production, this would connect to live APIs
        return {
            "high_demand_skills": [
                "artificial_intelligence", "machine_learning", "data_science",
                "cloud_computing", "cybersecurity", "digital_marketing",
                "mobile_app_development", "blockchain", "iot", "automation"
            ],
            "emerging_skills": [
                "prompt_engineering", "sustainable_technology", "green_skills",
                "mental_health_support", "remote_work_management"
            ],
            "declining_skills": [
                "manual_data_entry", "basic_computer_operations", "traditional_manufacturing"
            ]
        }
    
    def _load_regional_data(self) -> Dict[str, Any]:
        """Load regional employment and economic data"""
        return {
            "state_employment_rates": {
                "maharashtra": {"rate": 45.2, "growth": 3.1},
                "karnataka": {"rate": 42.8, "growth": 4.2},
                "tamil_nadu": {"rate": 41.5, "growth": 2.8},
                "telangana": {"rate": 39.7, "growth": 5.1},
                "gujarat": {"rate": 44.1, "growth": 3.5}
            },
            "sector_concentration": {
                "it_services": ["karnataka", "telangana", "maharashtra"],
                "manufacturing": ["tamil_nadu", "gujarat", "haryana"],
                "agriculture": ["punjab", "uttar_pradesh", "madhya_pradesh"],
                "financial_services": ["maharashtra", "delhi", "karnataka"]
            }
        }
    
    def _load_industry_predictions(self) -> Dict[str, Any]:
        """Load industry growth and transformation predictions"""
        return {
            "growth_sectors_2025": {
                "renewable_energy": {"growth_rate": 15.2, "job_creation": 500000},
                "healthcare_technology": {"growth_rate": 12.8, "job_creation": 300000},
                "fintech": {"growth_rate": 18.5, "job_creation": 250000},
                "edtech": {"growth_rate": 14.1, "job_creation": 200000},
                "logistics_tech": {"growth_rate": 11.7, "job_creation": 400000}
            },
            "transformation_sectors": {
                "traditional_banking": "digital_transformation",
                "retail": "e_commerce_integration",
                "education": "hybrid_learning_models",
                "healthcare": "telemedicine_expansion"
            }
        }
    
    def create_comprehensive_profile(self, 
                                   basic_data: Dict[str, Any],
                                   socio_economic: Dict[str, Any],
                                   psychometric: Dict[str, Any],
                                   accessibility: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create comprehensive learner profile with advanced analytics
        """
        try:
            # Process socio-economic profile
            socio_profile = self._process_socio_economic(socio_economic)
            
            # Process psychometric assessment
            psycho_profile = self._process_psychometric(psychometric)
            
            # Process accessibility requirements
            access_profile = self._process_accessibility(accessibility)
            
            # Calculate learning readiness score
            readiness_score = self._calculate_learning_readiness(
                socio_profile, psycho_profile, access_profile
            )
            
            # Analyze skill gap with market demand
            skill_gap_analysis = self._analyze_skill_gap(
                basic_data.get("prior_skills", []),
                basic_data.get("career_aspirations", ""),
                socio_economic.get("geographic_location", {})
            )
            
            # Generate personalization parameters
            personalization = self._generate_personalization_parameters(
                socio_profile, psycho_profile, access_profile
            )
            
            comprehensive_profile = {
                "learner_id": basic_data.get("user_id"),
                "timestamp": datetime.now().isoformat(),
                "basic_profile": basic_data,
                "socio_economic_profile": socio_profile,
                "psychometric_profile": psycho_profile,
                "accessibility_profile": access_profile,
                "learning_readiness_score": readiness_score,
                "skill_gap_analysis": skill_gap_analysis,
                "personalization_parameters": personalization,
                "recommended_interventions": self._recommend_interventions(
                    readiness_score, skill_gap_analysis, access_profile
                )
            }
            
            logger.info(f"✅ Comprehensive profile created for learner {basic_data.get('user_id')}")
            return comprehensive_profile
            
        except Exception as e:
            logger.error(f"❌ Error creating comprehensive profile: {e}")
            return {"error": str(e)}
    
    def _process_socio_economic(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process socio-economic data with advanced analytics"""
        location = data.get("geographic_location", {})
        state = location.get("state", "").lower()
        
        # Get regional employment data
        regional_data = self.regional_employment_data.get("state_employment_rates", {}).get(state, {})
        
        # Calculate economic opportunity score
        economic_score = self._calculate_economic_opportunity_score(data, regional_data)
        
        return {
            "income_analysis": {
                "category": data.get("income_category"),
                "affordability_index": self._calculate_affordability_index(data),
                "financial_support_needed": data.get("family_monthly_income", 0) < 25000
            },
            "geographic_analysis": {
                "location": location,
                "employment_rate": regional_data.get("rate", 35.0),
                "growth_rate": regional_data.get("growth", 2.0),
                "opportunity_score": economic_score,
                "urban_advantages": location.get("type") == "urban"
            },
            "digital_access_analysis": {
                "device_adequacy": len(data.get("digital_device_access", [])) >= 2,
                "connectivity_score": self._score_connectivity(data.get("internet_connectivity")),
                "digital_divide_risk": self._assess_digital_divide_risk(data)
            },
            "support_system": {
                "family_support": data.get("family_support_for_learning", "medium"),
                "community_resources": self._assess_community_resources(location),
                "transportation_accessibility": not data.get("transportation_constraints", False)
            }
        }
    
    def _process_psychometric(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process psychometric assessment data"""
        return {
            "learning_preferences": {
                "primary_style": data.get("learning_style"),
                "attention_span": data.get("attention_span_minutes", 30),
                "social_preference": data.get("social_learning_preference", "mixed"),
                "feedback_style": data.get("preferred_feedback_style", "periodic")
            },
            "cognitive_profile": {
                "problem_solving_style": data.get("problem_solving_approach", "systematic"),
                "technology_comfort": data.get("technology_comfort_level", "intermediate"),
                "stress_management": data.get("stress_tolerance", "medium"),
                "risk_tolerance": data.get("risk_tolerance", "medium")
            },
            "motivation_analysis": {
                "primary_motivators": data.get("motivation_factors", ["personal_growth"]),
                "intrinsic_motivation_score": self._calculate_intrinsic_motivation(data),
                "goal_orientation": self._assess_goal_orientation(data)
            },
            "learning_optimization": {
                "recommended_session_length": self._recommend_session_length(data),
                "optimal_difficulty_progression": self._recommend_difficulty_curve(data),
                "engagement_strategies": self._recommend_engagement_strategies(data)
            }
        }
    
    def _process_accessibility(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process accessibility requirements"""
        return {
            "physical_accessibility": {
                "visual_support_needed": data.get("visual_impairment") != "none",
                "auditory_support_needed": data.get("hearing_impairment") != "none",
                "motor_adaptation_needed": data.get("motor_impairment") != "none",
                "assistive_technology": data.get("assistive_technology_used", [])
            },
            "cognitive_accessibility": {
                "learning_differences": data.get("cognitive_considerations", []),
                "content_adaptation_needed": len(data.get("cognitive_considerations", [])) > 0,
                "pacing_adjustments": self._recommend_pacing_adjustments(data)
            },
            "content_preferences": {
                "preferred_formats": data.get("content_format_preferences", ["text", "video"]),
                "language_support": data.get("language_support_needed", False),
                "cultural_adaptations": data.get("cultural_considerations", [])
            },
            "inclusion_score": self._calculate_inclusion_score(data)
        }
    
    def _calculate_learning_readiness(self, 
                                    socio: Dict[str, Any], 
                                    psycho: Dict[str, Any], 
                                    access: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate comprehensive learning readiness score"""
        
        # Socio-economic readiness (40% weight)
        socio_score = (
            socio["digital_access_analysis"]["connectivity_score"] * 0.3 +
            socio["income_analysis"]["affordability_index"] * 0.3 +
            socio["geographic_analysis"]["opportunity_score"] * 0.2 +
            (1.0 if socio["support_system"]["family_support"] == "high" else 0.5) * 0.2
        ) * 40
        
        # Psychological readiness (35% weight)
        psycho_score = (
            psycho["motivation_analysis"]["intrinsic_motivation_score"] * 0.4 +
            (1.0 if psycho["cognitive_profile"]["technology_comfort"] in ["expert", "intermediate"] else 0.5) * 0.3 +
            (1.0 if psycho["cognitive_profile"]["stress_management"] in ["high", "medium"] else 0.3) * 0.3
        ) * 35
        
        # Accessibility readiness (25% weight)
        access_score = access["inclusion_score"] * 25
        
        total_score = socio_score + psycho_score + access_score
        
        return {
            "overall_score": round(total_score, 2),
            "component_scores": {
                "socio_economic": round(socio_score, 2),
                "psychological": round(psycho_score, 2),
                "accessibility": round(access_score, 2)
            },
            "readiness_level": self._categorize_readiness(total_score),
            "improvement_areas": self._identify_improvement_areas(socio_score, psycho_score, access_score)
        }
    
    def _analyze_skill_gap(self, 
                          current_skills: List[str], 
                          career_aspiration: str, 
                          location: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze skill gap with real-time market demand"""
        
        # Get industry-relevant skills for aspiration
        target_skills = self._get_target_skills_for_career(career_aspiration)
        
        # Calculate current skill coverage
        current_skills_normalized = [skill.lower().replace(" ", "_") for skill in current_skills]
        target_skills_normalized = [skill.lower().replace(" ", "_") for skill in target_skills]
        
        skill_coverage = len(set(current_skills_normalized) & set(target_skills_normalized)) / max(len(target_skills), 1)
        
        # Identify skill gaps
        missing_skills = set(target_skills_normalized) - set(current_skills_normalized)
        
        # Prioritize skills based on market demand
        prioritized_gaps = self._prioritize_skill_gaps(list(missing_skills), location)
        
        return {
            "current_skill_coverage": round(skill_coverage * 100, 2),
            "target_skills": target_skills,
            "missing_skills": list(missing_skills),
            "prioritized_skill_gaps": prioritized_gaps,
            "market_alignment_score": self._calculate_market_alignment_score(current_skills, location),
            "employability_prediction": self._predict_employability(skill_coverage, location),
            "learning_priority_matrix": self._create_priority_matrix(prioritized_gaps)
        }
    
    def _generate_personalization_parameters(self, 
                                           socio: Dict[str, Any], 
                                           psycho: Dict[str, Any], 
                                           access: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalization parameters for adaptive learning"""
        return {
            "content_delivery": {
                "preferred_formats": access["content_preferences"]["preferred_formats"],
                "session_length": psycho["learning_optimization"]["recommended_session_length"],
                "difficulty_progression": psycho["learning_optimization"]["optimal_difficulty_progression"],
                "language_preference": access["content_preferences"]["language_support"]
            },
            "engagement_strategies": psycho["learning_optimization"]["engagement_strategies"],
            "support_requirements": {
                "financial_assistance": socio["income_analysis"]["financial_support_needed"],
                "technical_support": socio["digital_access_analysis"]["digital_divide_risk"],
                "accessibility_accommodations": access["physical_accessibility"],
                "mentoring_needs": psycho["motivation_analysis"]["goal_orientation"] == "external"
            },
            "learning_path_adaptations": {
                "pace": "accelerated" if psycho["cognitive_profile"]["risk_tolerance"] == "high" else "standard",
                "structure": "flexible" if socio["support_system"]["family_support"] == "low" else "structured",
                "social_elements": psycho["learning_preferences"]["social_preference"]
            }
        }
    
    # Helper methods for calculations
    def _calculate_affordability_index(self, data: Dict[str, Any]) -> float:
        """Calculate affordability index based on income and family size"""
        income = data.get("family_monthly_income", 25000)
        family_size = data.get("family_size", 4)
        per_capita_income = income / family_size
        
        if per_capita_income > 15000:
            return 1.0
        elif per_capita_income > 10000:
            return 0.8
        elif per_capita_income > 5000:
            return 0.6
        else:
            return 0.4
    
    def _score_connectivity(self, connectivity: str) -> float:
        """Score internet connectivity quality"""
        scores = {
            "high_speed": 1.0,
            "low_speed": 0.7,
            "intermittent": 0.4,
            "none": 0.0
        }
        return scores.get(connectivity, 0.5)
    
    def _calculate_inclusion_score(self, data: Dict[str, Any]) -> float:
        """Calculate accessibility inclusion score"""
        base_score = 1.0
        
        # Reduce score for each accessibility barrier
        if data.get("visual_impairment") != "none":
            base_score -= 0.2
        if data.get("hearing_impairment") != "none":
            base_score -= 0.2
        if data.get("motor_impairment") != "none":
            base_score -= 0.1
        if len(data.get("cognitive_considerations", [])) > 0:
            base_score -= 0.2
        
        # Add score for assistive technology
        if len(data.get("assistive_technology_used", [])) > 0:
            base_score += 0.2
        
        return max(0.1, min(1.0, base_score))
    
    def _get_target_skills_for_career(self, career: str) -> List[str]:
        """Get target skills for specific career aspiration"""
        career_skills_map = {
            "data_scientist": ["python", "machine_learning", "statistics", "sql", "data_visualization"],
            "software_developer": ["programming", "web_development", "databases", "version_control", "testing"],
            "digital_marketer": ["seo", "social_media", "content_marketing", "analytics", "paid_advertising"],
            "web_developer": ["html", "css", "javascript", "responsive_design", "frameworks"],
            "data_analyst": ["excel", "sql", "python", "tableau", "statistics"]
        }
        
        career_normalized = career.lower().replace(" ", "_")
        return career_skills_map.get(career_normalized, ["communication", "problem_solving", "teamwork"])
    
    def _categorize_readiness(self, score: float) -> str:
        """Categorize learning readiness level"""
        if score >= 80:
            return "high"
        elif score >= 60:
            return "medium"
        elif score >= 40:
            return "low"
        else:
            return "requires_intervention"
    
    def _identify_improvement_areas(self, socio: float, psycho: float, access: float) -> List[str]:
        """Identify areas needing improvement"""
        areas = []
        if socio < 15:  # Less than 37.5% of 40%
            areas.append("socio_economic_support")
        if psycho < 12:  # Less than 34% of 35%
            areas.append("motivation_and_preparation")
        if access < 8:   # Less than 32% of 25%
            areas.append("accessibility_accommodations")
        return areas

# Global instance
advanced_profiler = AdvancedLearnerProfiler()