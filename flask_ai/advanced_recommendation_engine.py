"""
Advanced AI/ML Recommendation Engine
Multi-algorithm approach for personalized learning pathway generation
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from enum import Enum
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class RecommendationAlgorithm(Enum):
    COLLABORATIVE_FILTERING = "collaborative_filtering"
    CONTENT_BASED = "content_based"
    HYBRID = "hybrid"
    DEEP_LEARNING = "deep_learning"
    REINFORCEMENT_LEARNING = "reinforcement_learning"
    MULTI_OBJECTIVE = "multi_objective"

class PathwayObjective(Enum):
    MINIMIZE_TIME = "minimize_time"
    MINIMIZE_COST = "minimize_cost"
    MAXIMIZE_EMPLOYMENT = "maximize_employment"
    MAXIMIZE_SALARY = "maximize_salary"
    MAXIMIZE_SATISFACTION = "maximize_satisfaction"
    BALANCE_ALL = "balance_all"

@dataclass
class LearningResource:
    """Learning resource data structure"""
    id: str
    title: str
    type: str  # course, certification, book, project, mentorship
    provider: str
    nsqf_level: int
    difficulty: str
    duration_hours: int
    cost: float
    skills_covered: List[str]
    prerequisites: List[str]
    success_rate: float
    user_ratings: List[float]
    employment_impact: float
    salary_impact: float
    tags: List[str]

@dataclass
class UserBehavior:
    """User learning behavior data"""
    user_id: str
    completed_resources: List[str]
    resource_ratings: Dict[str, float]
    time_spent: Dict[str, int]
    skill_assessments: Dict[str, float]
    career_progress: List[Dict[str, Any]]
    learning_patterns: Dict[str, Any]
    preferences: Dict[str, Any]

@dataclass
class RecommendationResult:
    """Recommendation result structure"""
    pathway_id: str
    resources: List[LearningResource]
    confidence_score: float
    algorithm_used: RecommendationAlgorithm
    objectives_met: Dict[PathwayObjective, float]
    personalization_factors: Dict[str, float]
    estimated_outcomes: Dict[str, Any]
    alternative_pathways: List[str]

class AdvancedRecommendationEngine:
    """
    Advanced recommendation engine with multiple ML algorithms
    """
    
    def __init__(self):
        self.algorithms = {
            RecommendationAlgorithm.COLLABORATIVE_FILTERING: self._collaborative_filtering,
            RecommendationAlgorithm.CONTENT_BASED: self._content_based_filtering,
            RecommendationAlgorithm.HYBRID: self._hybrid_recommendation,
            RecommendationAlgorithm.MULTI_OBJECTIVE: self._multi_objective_optimization
        }
        
        self.user_profiles = {}
        self.resource_database = self._initialize_resource_database()
        self.user_behavior_history = self._initialize_behavior_data()
        self.skill_taxonomy = self._load_skill_taxonomy()
        self.market_weights = self._load_market_weights()
        
        # ML Models
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.satisfaction_predictor = RandomForestRegressor(n_estimators=100)
        self.employment_predictor = RandomForestRegressor(n_estimators=100)
        self.user_clusterer = KMeans(n_clusters=10, random_state=42)
        
        self._train_models()
    
    def _initialize_resource_database(self) -> List[LearningResource]:
        """Initialize comprehensive learning resource database"""
        resources = [
            LearningResource(
                id="course_001",
                title="Python for Data Science",
                type="course",
                provider="NCVET Certified",
                nsqf_level=5,
                difficulty="intermediate",
                duration_hours=120,
                cost=4999.0,
                skills_covered=["python", "data_analysis", "pandas", "numpy"],
                prerequisites=["basic_programming"],
                success_rate=0.85,
                user_ratings=[4.2, 4.5, 4.1, 4.3, 4.6],
                employment_impact=0.78,
                salary_impact=0.65,
                tags=["programming", "data_science", "beginner_friendly"]
            ),
            LearningResource(
                id="cert_001",
                title="AWS Cloud Practitioner",
                type="certification",
                provider="Amazon Web Services",
                nsqf_level=6,
                difficulty="intermediate",
                duration_hours=80,
                cost=10000.0,
                skills_covered=["cloud_computing", "aws", "infrastructure"],
                prerequisites=["basic_networking", "linux_basics"],
                success_rate=0.72,
                user_ratings=[4.0, 4.2, 3.9, 4.1, 4.3],
                employment_impact=0.82,
                salary_impact=0.75,
                tags=["cloud", "certification", "high_demand"]
            ),
            LearningResource(
                id="project_001",
                title="E-commerce Website Development",
                type="project",
                provider="Industry Mentor",
                nsqf_level=6,
                difficulty="advanced",
                duration_hours=200,
                cost=15000.0,
                skills_covered=["web_development", "javascript", "database", "ui_ux"],
                prerequisites=["html_css", "javascript_basics", "database_basics"],
                success_rate=0.68,
                user_ratings=[4.4, 4.6, 4.2, 4.5, 4.7],
                employment_impact=0.88,
                salary_impact=0.80,
                tags=["project", "portfolio", "industry_experience"]
            ),
            LearningResource(
                id="book_001",
                title="Digital Marketing Fundamentals",
                type="book",
                provider="Skill India Publications",
                nsqf_level=4,
                difficulty="beginner",
                duration_hours=40,
                cost=999.0,
                skills_covered=["digital_marketing", "seo", "social_media"],
                prerequisites=[],
                success_rate=0.90,
                user_ratings=[4.1, 4.0, 4.2, 3.9, 4.3],
                employment_impact=0.60,
                salary_impact=0.45,
                tags=["marketing", "self_paced", "affordable"]
            ),
            LearningResource(
                id="mentor_001",
                title="One-on-One Data Science Mentorship",
                type="mentorship",
                provider="Industry Expert",
                nsqf_level=7,
                difficulty="advanced",
                duration_hours=50,
                cost=25000.0,
                skills_covered=["machine_learning", "career_guidance", "industry_insights"],
                prerequisites=["python", "statistics", "basic_ml"],
                success_rate=0.95,
                user_ratings=[4.8, 4.9, 4.7, 4.8, 4.9],
                employment_impact=0.92,
                salary_impact=0.85,
                tags=["mentorship", "personalized", "premium"]
            )
        ]
        return resources
    
    def _initialize_behavior_data(self) -> Dict[str, UserBehavior]:
        """Initialize user behavior data for collaborative filtering"""
        # Simulated user behavior data
        behavior_data = {}
        
        for i in range(100):  # 100 simulated users
            user_id = f"user_{i:03d}"
            completed = np.random.choice([res.id for res in self.resource_database], 
                                       size=np.random.randint(1, 6), replace=False).tolist()
            
            ratings = {res_id: np.random.uniform(3.0, 5.0) for res_id in completed}
            time_spent = {res_id: np.random.randint(10, 200) for res_id in completed}
            
            behavior_data[user_id] = UserBehavior(
                user_id=user_id,
                completed_resources=completed,
                resource_ratings=ratings,
                time_spent=time_spent,
                skill_assessments={},
                career_progress=[],
                learning_patterns={},
                preferences={}
            )
        
        return behavior_data
    
    def _load_skill_taxonomy(self) -> Dict[str, List[str]]:
        """Load hierarchical skill taxonomy"""
        return {
            "programming": ["python", "java", "javascript", "c++", "go"],
            "data_science": ["machine_learning", "statistics", "data_visualization", "deep_learning"],
            "web_development": ["html", "css", "react", "angular", "node_js"],
            "cloud_computing": ["aws", "azure", "gcp", "docker", "kubernetes"],
            "digital_marketing": ["seo", "social_media", "content_marketing", "ppc"],
            "project_management": ["agile", "scrum", "risk_management", "stakeholder_management"]
        }
    
    def _load_market_weights(self) -> Dict[str, float]:
        """Load market demand weights for skills"""
        return {
            "python": 0.95,
            "machine_learning": 0.90,
            "cloud_computing": 0.88,
            "javascript": 0.85,
            "data_analysis": 0.82,
            "digital_marketing": 0.75,
            "project_management": 0.70
        }
    
    def _train_models(self):
        """Train ML models for recommendation"""
        # Prepare training data
        resource_features = []
        satisfaction_scores = []
        employment_outcomes = []
        
        for resource in self.resource_database:
            features = [
                resource.nsqf_level,
                resource.duration_hours,
                np.log(resource.cost + 1),
                len(resource.skills_covered),
                resource.success_rate,
                np.mean(resource.user_ratings) if resource.user_ratings else 4.0,
                resource.employment_impact,
                resource.salary_impact
            ]
            resource_features.append(features)
            satisfaction_scores.append(np.mean(resource.user_ratings) if resource.user_ratings else 4.0)
            employment_outcomes.append(resource.employment_impact)
        
        # Train satisfaction predictor
        if len(resource_features) > 1:
            self.satisfaction_predictor.fit(resource_features, satisfaction_scores)
            self.employment_predictor.fit(resource_features, employment_outcomes)
        
        logger.info("✅ ML models trained successfully")
    
    def generate_personalized_recommendations(self, 
                                            user_profile: Dict[str, Any],
                                            objectives: List[PathwayObjective] = None,
                                            algorithm: RecommendationAlgorithm = None,
                                            max_resources: int = 10) -> RecommendationResult:
        """
        Generate personalized learning pathway recommendations
        """
        try:
            objectives = objectives or [PathwayObjective.BALANCE_ALL]
            algorithm = algorithm or RecommendationAlgorithm.HYBRID
            
            # Select and apply recommendation algorithm
            if algorithm in self.algorithms:
                recommendations = self.algorithms[algorithm](user_profile, objectives, max_resources)
            else:
                recommendations = self._hybrid_recommendation(user_profile, objectives, max_resources)
            
            # Calculate confidence score
            confidence = self._calculate_confidence_score(recommendations, user_profile)
            
            # Evaluate objectives
            objectives_met = self._evaluate_objectives(recommendations, objectives, user_profile)
            
            # Calculate personalization factors
            personalization_factors = self._calculate_personalization_factors(recommendations, user_profile)
            
            # Estimate outcomes
            estimated_outcomes = self._estimate_outcomes(recommendations, user_profile)
            
            # Generate alternative pathways
            alternative_pathways = self._generate_alternatives(user_profile, recommendations, 3)
            
            result = RecommendationResult(
                pathway_id=f"pathway_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                resources=recommendations,
                confidence_score=confidence,
                algorithm_used=algorithm,
                objectives_met=objectives_met,
                personalization_factors=personalization_factors,
                estimated_outcomes=estimated_outcomes,
                alternative_pathways=alternative_pathways
            )
            
            logger.info(f"✅ Generated recommendations using {algorithm.value}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error generating recommendations: {e}")
            return self._get_fallback_recommendations(user_profile)
    
    def _collaborative_filtering(self, 
                                user_profile: Dict[str, Any], 
                                objectives: List[PathwayObjective],
                                max_resources: int) -> List[LearningResource]:
        """
        Collaborative filtering based on similar users
        """
        user_skills = user_profile.get("prior_skills", [])
        user_aspirations = user_profile.get("career_aspirations", "")
        
        # Find similar users
        similar_users = self._find_similar_users(user_profile)
        
        # Get resources that similar users completed and rated highly
        recommended_resource_ids = []
        resource_scores = {}
        
        for similar_user_id in similar_users[:10]:  # Top 10 similar users
            if similar_user_id in self.user_behavior_history:
                user_behavior = self.user_behavior_history[similar_user_id]
                
                for resource_id, rating in user_behavior.resource_ratings.items():
                    if rating >= 4.0 and resource_id not in recommended_resource_ids:
                        if resource_id in resource_scores:
                            resource_scores[resource_id] += rating
                        else:
                            resource_scores[resource_id] = rating
        
        # Sort by score and filter resources
        sorted_resources = sorted(resource_scores.items(), key=lambda x: x[1], reverse=True)
        
        recommendations = []
        for resource_id, score in sorted_resources[:max_resources]:
            resource = self._get_resource_by_id(resource_id)
            if resource and self._is_resource_suitable(resource, user_profile):
                recommendations.append(resource)
        
        return recommendations
    
    def _content_based_filtering(self, 
                                user_profile: Dict[str, Any], 
                                objectives: List[PathwayObjective],
                                max_resources: int) -> List[LearningResource]:
        """
        Content-based filtering based on skills and aspirations
        """
        user_skills = set(user_profile.get("prior_skills", []))
        career_aspirations = user_profile.get("career_aspirations", "").lower()
        learning_pace = user_profile.get("learning_pace", "medium")
        
        # Calculate skill gaps
        target_skills = self._get_target_skills(career_aspirations)
        skill_gaps = set(target_skills) - user_skills
        
        # Score resources based on relevance
        resource_scores = []
        
        for resource in self.resource_database:
            score = 0
            
            # Skill coverage score
            covered_gaps = set(resource.skills_covered) & skill_gaps
            score += len(covered_gaps) * 10
            
            # NSQF level appropriateness
            target_nsqf = self._estimate_target_nsqf_level(user_profile)
            nsqf_diff = abs(resource.nsqf_level - target_nsqf)
            score += max(0, 10 - nsqf_diff * 2)
            
            # Learning pace compatibility
            pace_scores = {"slow": 8, "medium": 10, "fast": 6}
            if resource.duration_hours <= 50:
                pace_scores = {"slow": 6, "medium": 8, "fast": 10}
            elif resource.duration_hours >= 150:
                pace_scores = {"slow": 10, "medium": 8, "fast": 6}
            
            score += pace_scores.get(learning_pace, 8)
            
            # Success rate and ratings
            score += resource.success_rate * 5
            score += np.mean(resource.user_ratings) if resource.user_ratings else 2
            
            # Market demand weight
            max_market_weight = max([self.market_weights.get(skill, 0.5) for skill in resource.skills_covered])
            score += max_market_weight * 10
            
            resource_scores.append((resource, score))
        
        # Sort by score and return top resources
        resource_scores.sort(key=lambda x: x[1], reverse=True)
        return [resource for resource, score in resource_scores[:max_resources]]
    
    def _hybrid_recommendation(self, 
                              user_profile: Dict[str, Any], 
                              objectives: List[PathwayObjective],
                              max_resources: int) -> List[LearningResource]:
        """
        Hybrid approach combining multiple algorithms
        """
        # Get recommendations from different algorithms
        collaborative_recs = self._collaborative_filtering(user_profile, objectives, max_resources // 2)
        content_recs = self._content_based_filtering(user_profile, objectives, max_resources // 2)
        
        # Combine and deduplicate
        all_recommendations = collaborative_recs + content_recs
        seen_ids = set()
        unique_recommendations = []
        
        for resource in all_recommendations:
            if resource.id not in seen_ids:
                unique_recommendations.append(resource)
                seen_ids.add(resource.id)
        
        # Apply multi-objective optimization if specified
        if PathwayObjective.BALANCE_ALL in objectives or len(objectives) > 1:
            unique_recommendations = self._optimize_for_objectives(unique_recommendations, objectives, user_profile)
        
        return unique_recommendations[:max_resources]
    
    def _multi_objective_optimization(self, 
                                     user_profile: Dict[str, Any], 
                                     objectives: List[PathwayObjective],
                                     max_resources: int) -> List[LearningResource]:
        """
        Multi-objective optimization considering time, cost, and employment probability
        """
        # Start with content-based recommendations
        candidate_resources = self._content_based_filtering(user_profile, objectives, max_resources * 2)
        
        # Define objective functions
        def time_objective(resources):
            return sum(r.duration_hours for r in resources)
        
        def cost_objective(resources):
            return sum(r.cost for r in resources)
        
        def employment_objective(resources):
            return -sum(r.employment_impact for r in resources)  # Negative for minimization
        
        def salary_objective(resources):
            return -sum(r.salary_impact for r in resources)  # Negative for minimization
        
        # Pareto optimization simulation
        best_combinations = []
        
        # Try different combinations
        for i in range(min(len(candidate_resources), max_resources)):
            for j in range(i + 1, min(len(candidate_resources), max_resources + 1)):
                combination = candidate_resources[i:j]
                
                objectives_scores = {
                    PathwayObjective.MINIMIZE_TIME: time_objective(combination),
                    PathwayObjective.MINIMIZE_COST: cost_objective(combination),
                    PathwayObjective.MAXIMIZE_EMPLOYMENT: employment_objective(combination),
                    PathwayObjective.MAXIMIZE_SALARY: salary_objective(combination)
                }
                
                # Calculate weighted score based on user objectives
                weighted_score = 0
                for objective in objectives:
                    if objective in objectives_scores:
                        if objective in [PathwayObjective.MINIMIZE_TIME, PathwayObjective.MINIMIZE_COST]:
                            # Lower is better
                            normalized_score = 1 / (1 + objectives_scores[objective] / 1000)
                        else:
                            # Higher is better (already negated)
                            normalized_score = -objectives_scores[objective]
                        weighted_score += normalized_score
                
                best_combinations.append((combination, weighted_score))
        
        # Select best combination
        if best_combinations:
            best_combinations.sort(key=lambda x: x[1], reverse=True)
            return best_combinations[0][0]
        
        return candidate_resources[:max_resources]
    
    def update_user_feedback(self, 
                           user_id: str, 
                           resource_id: str, 
                           feedback: Dict[str, Any]):
        """
        Update recommendation system with user feedback
        """
        try:
            if user_id not in self.user_behavior_history:
                self.user_behavior_history[user_id] = UserBehavior(
                    user_id=user_id,
                    completed_resources=[],
                    resource_ratings={},
                    time_spent={},
                    skill_assessments={},
                    career_progress=[],
                    learning_patterns={},
                    preferences={}
                )
            
            user_behavior = self.user_behavior_history[user_id]
            
            # Update ratings
            if "rating" in feedback:
                user_behavior.resource_ratings[resource_id] = feedback["rating"]
            
            # Update completion status
            if feedback.get("completed", False) and resource_id not in user_behavior.completed_resources:
                user_behavior.completed_resources.append(resource_id)
            
            # Update time spent
            if "time_spent" in feedback:
                user_behavior.time_spent[resource_id] = feedback["time_spent"]
            
            # Update learning patterns
            user_behavior.learning_patterns.update(feedback.get("learning_patterns", {}))
            
            # Retrain models periodically
            if len(self.user_behavior_history) % 10 == 0:
                self._train_models()
            
            logger.info(f"✅ Updated feedback for user {user_id}, resource {resource_id}")
            
        except Exception as e:
            logger.error(f"❌ Error updating user feedback: {e}")
    
    def get_recommendation_explanation(self, 
                                     recommendation_result: RecommendationResult,
                                     user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate explanation for recommendations
        """
        explanation = {
            "algorithm_rationale": self._get_algorithm_rationale(recommendation_result.algorithm_used),
            "personalization_factors": recommendation_result.personalization_factors,
            "skill_alignment": self._explain_skill_alignment(recommendation_result.resources, user_profile),
            "career_relevance": self._explain_career_relevance(recommendation_result.resources, user_profile),
            "market_insights": self._explain_market_insights(recommendation_result.resources),
            "learning_path_logic": self._explain_learning_path_logic(recommendation_result.resources),
            "alternative_options": self._explain_alternatives(recommendation_result.alternative_pathways)
        }
        
        return explanation
    
    # Helper methods
    def _find_similar_users(self, user_profile: Dict[str, Any]) -> List[str]:
        """Find users with similar profiles"""
        user_skills = set(user_profile.get("prior_skills", []))
        user_aspirations = user_profile.get("career_aspirations", "").lower()
        
        similar_users = []
        
        for user_id, behavior in self.user_behavior_history.items():
            # Calculate similarity based on completed resources and implicit skills
            completed_skills = set()
            for resource_id in behavior.completed_resources:
                resource = self._get_resource_by_id(resource_id)
                if resource:
                    completed_skills.update(resource.skills_covered)
            
            # Jaccard similarity for skills
            skill_similarity = len(user_skills & completed_skills) / max(len(user_skills | completed_skills), 1)
            
            if skill_similarity > 0.3:  # Threshold for similarity
                similar_users.append(user_id)
        
        return similar_users
    
    def _get_resource_by_id(self, resource_id: str) -> Optional[LearningResource]:
        """Get resource by ID"""
        for resource in self.resource_database:
            if resource.id == resource_id:
                return resource
        return None
    
    def _calculate_confidence_score(self, 
                                   recommendations: List[LearningResource], 
                                   user_profile: Dict[str, Any]) -> float:
        """Calculate confidence score for recommendations"""
        if not recommendations:
            return 0.0
        
        # Factors affecting confidence
        skill_coverage_score = len(set().union(*[r.skills_covered for r in recommendations])) / 10
        success_rate_score = np.mean([r.success_rate for r in recommendations])
        rating_score = np.mean([np.mean(r.user_ratings) if r.user_ratings else 3.5 for r in recommendations]) / 5
        
        confidence = (skill_coverage_score * 0.3 + success_rate_score * 0.4 + rating_score * 0.3)
        return min(1.0, confidence)

# Global instance
advanced_recommendation_engine = AdvancedRecommendationEngine()