"""
NSQF (National Skills Qualifications Framework) Service
Integrates ML-based NSQF level prediction and pathway recommendations
"""

import os
import joblib
import logging
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class NSQFService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.model_loaded = False
        self._load_models()
    
    def _load_models(self):
        """Load NSQF ML models"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), 'nsqf_model.joblib')
            vectorizer_path = os.path.join(os.path.dirname(__file__), 'nsqf_vectorizer.joblib')
            
            if os.path.exists(model_path) and os.path.exists(vectorizer_path):
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                self.model_loaded = True
                logger.info("✅ NSQF models loaded successfully")
            else:
                logger.warning("⚠️ NSQF model files not found")
                
        except Exception as e:
            logger.error(f"❌ Failed to load NSQF models: {e}")
            self.model_loaded = False
    
    def predict_nsqf_level(self, profile: Dict[str, Any]) -> Optional[str]:
        """
        Predict NSQF level based on user profile
        
        Args:
            profile: Dictionary containing user profile data
                - career_aspirations: str
                - prior_skills: List[str]
                - academic_background: str (optional)
        
        Returns:
            Predicted NSQF level as string or None if prediction fails
        """
        if not self.model_loaded:
            logger.warning("NSQF models not loaded, cannot predict level")
            return None
        
        try:
            # Extract relevant text for prediction
            aspirations = profile.get("career_aspirations", "")
            prior_skills = profile.get("prior_skills", [])
            academic_bg = profile.get("academic_background", "")
            
            # Combine text features
            input_text = " ".join([aspirations, academic_bg] + prior_skills)
            
            if not input_text.strip():
                logger.warning("No input text provided for NSQF prediction")
                return None
            
            # Vectorize and predict
            X_pred = self.vectorizer.transform([input_text])
            predicted_level = self.model.predict(X_pred)[0]
            
            logger.info(f"🎯 Predicted NSQF Level: {predicted_level}")
            return str(predicted_level)
            
        except Exception as e:
            logger.error(f"❌ NSQF prediction failed: {e}")
            return None
    
    def get_nsqf_info(self, level: str) -> Dict[str, Any]:
        """
        Get information about a specific NSQF level
        
        Args:
            level: NSQF level (1-10)
        
        Returns:
            Dictionary with NSQF level information
        """
        nsqf_descriptions = {
            "1": {
                "level": 1,
                "title": "NSQF Level 1",
                "description": "Prepares individuals for basic, routine tasks under direct supervision.",
                "job_roles": ["Helper", "Assistant", "Trainee"],
                "skills_focus": ["Basic motor skills", "Following instructions", "Simple tasks"],
                "employment_type": "Entry-level positions with supervision"
            },
            "2": {
                "level": 2,
                "title": "NSQF Level 2", 
                "description": "Enables performance of routine tasks with some autonomy.",
                "job_roles": ["Junior Assistant", "Operator", "Helper"],
                "skills_focus": ["Basic operational skills", "Simple problem solving"],
                "employment_type": "Semi-skilled positions"
            },
            "3": {
                "level": 3,
                "title": "NSQF Level 3",
                "description": "Enables performance of a range of activities with some complexity.",
                "job_roles": ["Technician Helper", "Junior Operator"],
                "skills_focus": ["Technical skills", "Quality control", "Basic supervision"],
                "employment_type": "Skilled worker positions"
            },
            "4": {
                "level": 4,
                "title": "NSQF Level 4",
                "description": "Enables independent work in familiar contexts, with some responsibility for quality.",
                "job_roles": ["Junior Technician", "Data Entry Operator", "Sales Associate"],
                "skills_focus": ["Technical proficiency", "Quality assurance", "Customer service"],
                "employment_type": "Skilled positions with some responsibility"
            },
            "5": {
                "level": 5,
                "title": "NSQF Level 5",
                "description": "Provides comprehensive, specialized knowledge and skills for skilled work.",
                "job_roles": ["Technician", "Web Developer", "Marketing Executive"],
                "skills_focus": ["Specialized skills", "Problem solving", "Team collaboration"],
                "employment_type": "Professional roles with expertise"
            },
            "6": {
                "level": 6,
                "title": "NSQF Level 6",
                "description": "Advanced knowledge and skills for complex work with significant autonomy.",
                "job_roles": ["Senior Technician", "Software Developer", "Team Lead"],
                "skills_focus": ["Advanced technical skills", "Leadership", "Innovation"],
                "employment_type": "Senior professional positions"
            },
            "7": {
                "level": 7,
                "title": "NSQF Level 7",
                "description": "Advanced knowledge and skills for complex, specialized work and leadership.",
                "job_roles": ["Senior Developer", "Project Manager", "Consultant"],
                "skills_focus": ["Expert knowledge", "Strategic thinking", "Team management"],
                "employment_type": "Management and specialist roles"
            },
            "8": {
                "level": 8,
                "title": "NSQF Level 8",
                "description": "Advanced specialized knowledge for innovation and complex problem-solving.",
                "job_roles": ["Principal Engineer", "Senior Manager", "Subject Expert"],
                "skills_focus": ["Innovation", "Complex problem solving", "Strategic planning"],
                "employment_type": "Senior management and expert positions"
            },
            "9": {
                "level": 9,
                "title": "NSQF Level 9",
                "description": "Master's level knowledge for research and advanced practice.",
                "job_roles": ["Research Scientist", "Senior Consultant", "Department Head"],
                "skills_focus": ["Research", "Advanced analysis", "Organizational leadership"],
                "employment_type": "Research and senior leadership roles"
            },
            "10": {
                "level": 10,
                "title": "NSQF Level 10",
                "description": "Doctoral level knowledge for original research and thought leadership.",
                "job_roles": ["Principal Scientist", "Director", "Industry Expert"],
                "skills_focus": ["Original research", "Thought leadership", "Strategic vision"],
                "employment_type": "Executive and research leadership positions"
            }
        }
        
        return nsqf_descriptions.get(str(level), {
            "level": level,
            "title": f"NSQF Level {level}",
            "description": "Level information not available",
            "job_roles": [],
            "skills_focus": [],
            "employment_type": "Information not available"
        })
    
    def generate_learning_pathway(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized learning pathway based on NSQF prediction
        
        Args:
            profile: User profile dictionary
        
        Returns:
            Learning pathway recommendations
        """
        predicted_level = self.predict_nsqf_level(profile)
        
        if not predicted_level:
            return {
                "error": "Could not predict NSQF level",
                "recommendations": []
            }
        
        level_info = self.get_nsqf_info(predicted_level)
        
        # Generate progressive pathway
        pathway = []
        current_level = int(predicted_level)
        
        # Add prerequisite levels if starting above level 1
        if current_level > 1:
            for level in range(max(1, current_level - 2), current_level):
                level_data = self.get_nsqf_info(str(level))
                pathway.append({
                    "phase": f"Foundation - Level {level}",
                    "nsqf_level": level,
                    "description": level_data["description"],
                    "focus": "Building foundational skills",
                    "duration": "2-4 months"
                })
        
        # Add target level
        pathway.append({
            "phase": f"Target - Level {current_level}",
            "nsqf_level": current_level,
            "description": level_info["description"],
            "focus": "Achieving target competency",
            "duration": "4-6 months"
        })
        
        # Add advancement opportunity
        if current_level < 10:
            next_level_data = self.get_nsqf_info(str(current_level + 1))
            pathway.append({
                "phase": f"Advancement - Level {current_level + 1}",
                "nsqf_level": current_level + 1,
                "description": next_level_data["description"],
                "focus": "Career advancement",
                "duration": "6-12 months"
            })
        
        return {
            "predicted_level": predicted_level,
            "level_info": level_info,
            "learning_pathway": pathway,
            "recommendations": {
                "immediate_focus": level_info["skills_focus"],
                "career_opportunities": level_info["job_roles"],
                "employment_prospects": level_info["employment_type"]
            }
        }

# Global instance
nsqf_service = NSQFService()