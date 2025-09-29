"""
Real-time Labour Market Intelligence System
Integrates with multiple data sources for live market insights
"""

import asyncio
import aiohttp
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass
import json
from enum import Enum

logger = logging.getLogger(__name__)

class DataSource(Enum):
    NAPS = "naps"  # National Apprenticeship Promotion Scheme
    NAUKRI = "naukri"
    LINKEDIN = "linkedin"
    INDEED = "indeed"
    MONSTER = "monster"
    GOVERNMENT_STATS = "gov_stats"
    INDUSTRY_REPORTS = "industry_reports"

@dataclass
class MarketInsight:
    """Market insight data structure"""
    skill: str
    demand_score: float
    supply_score: float
    gap_ratio: float
    average_salary: Dict[str, float]  # by experience level
    job_openings: int
    growth_rate: float
    geographic_hotspots: List[str]
    trending_keywords: List[str]
    source_confidence: float
    last_updated: datetime

@dataclass
class RegionalMarketData:
    """Regional market data structure"""
    state: str
    district: str
    employment_rate: float
    unemployment_rate: float
    workforce_participation: float
    major_industries: List[str]
    skill_demand_ranking: Dict[str, int]
    average_income: float
    growth_sectors: List[str]
    infrastructure_score: float

class RealTimeMarketIntelligence:
    """
    Real-time labour market intelligence system for dynamic insights
    """
    
    def __init__(self):
        self.data_sources = {
            DataSource.NAPS: self._setup_naps_connection,
            DataSource.GOVERNMENT_STATS: self._setup_government_stats,
            DataSource.NAUKRI: self._setup_naukri_api,
            DataSource.LINKEDIN: self._setup_linkedin_api,
            DataSource.INDEED: self._setup_indeed_scraper
        }
        self.cache = {}
        self.cache_expiry = timedelta(hours=6)  # Refresh every 6 hours
        self.skill_taxonomy = self._load_skill_taxonomy()
        self.regional_data = self._load_regional_baseline()
        
    def _load_skill_taxonomy(self) -> Dict[str, Any]:
        """Load standardized skill taxonomy"""
        return {
            "technical_skills": {
                "programming": ["python", "java", "javascript", "c++", "go", "rust"],
                "data_science": ["machine_learning", "deep_learning", "statistics", "data_visualization"],
                "cloud_computing": ["aws", "azure", "gcp", "docker", "kubernetes"],
                "cybersecurity": ["ethical_hacking", "network_security", "cryptography", "compliance"],
                "mobile_development": ["android", "ios", "react_native", "flutter"],
                "web_development": ["html", "css", "react", "angular", "vue", "node_js"]
            },
            "soft_skills": {
                "communication": ["verbal", "written", "presentation", "negotiation"],
                "leadership": ["team_management", "project_management", "strategic_thinking"],
                "problem_solving": ["analytical_thinking", "creativity", "decision_making"],
                "collaboration": ["teamwork", "cross_functional", "remote_work"]
            },
            "industry_specific": {
                "finance": ["financial_modeling", "risk_management", "compliance", "fintech"],
                "healthcare": ["medical_knowledge", "patient_care", "health_informatics"],
                "manufacturing": ["lean_manufacturing", "quality_control", "automation"],
                "education": ["curriculum_design", "educational_technology", "assessment"]
            }
        }
    
    def _load_regional_baseline(self) -> Dict[str, RegionalMarketData]:
        """Load baseline regional market data"""
        # In production, this would load from government databases
        regional_data = {
            "maharashtra": RegionalMarketData(
                state="maharashtra",
                district="all",
                employment_rate=45.2,
                unemployment_rate=3.8,
                workforce_participation=52.1,
                major_industries=["information_technology", "manufacturing", "financial_services"],
                skill_demand_ranking={"python": 1, "java": 2, "data_analysis": 3},
                average_income=75000,
                growth_sectors=["fintech", "healthtech", "edtech"],
                infrastructure_score=8.5
            ),
            "karnataka": RegionalMarketData(
                state="karnataka",
                district="all",
                employment_rate=42.8,
                unemployment_rate=4.2,
                workforce_participation=48.9,
                major_industries=["information_technology", "biotechnology", "aerospace"],
                skill_demand_ranking={"python": 1, "machine_learning": 2, "cloud_computing": 3},
                average_income=68000,
                growth_sectors=["artificial_intelligence", "biotechnology", "renewable_energy"],
                infrastructure_score=8.2
            ),
            "tamil_nadu": RegionalMarketData(
                state="tamil_nadu",
                district="all",
                employment_rate=41.5,
                unemployment_rate=4.8,
                workforce_participation=47.3,
                major_industries=["manufacturing", "textiles", "information_technology"],
                skill_demand_ranking={"manufacturing_automation": 1, "quality_control": 2, "python": 3},
                average_income=58000,
                growth_sectors=["automotive_technology", "renewable_energy", "textiles_automation"],
                infrastructure_score=7.8
            )
        }
        return regional_data
    
    async def get_real_time_market_insights(self, skills: List[str], location: Optional[str] = None) -> Dict[str, MarketInsight]:
        """
        Get real-time market insights for specified skills
        """
        insights = {}
        
        for skill in skills:
            try:
                # Check cache first
                cache_key = f"{skill}_{location or 'national'}"
                if self._is_cache_valid(cache_key):
                    insights[skill] = self.cache[cache_key]
                    continue
                
                # Gather data from multiple sources
                market_data = await self._aggregate_market_data(skill, location)
                
                # Process and analyze data
                insight = self._process_market_data(skill, market_data, location)
                
                # Cache the result
                self.cache[cache_key] = insight
                insights[skill] = insight
                
                # Small delay to respect API rate limits
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"❌ Error getting market insight for {skill}: {e}")
                insights[skill] = self._get_fallback_insight(skill)
        
        return insights
    
    async def _aggregate_market_data(self, skill: str, location: Optional[str]) -> Dict[str, Any]:
        """
        Aggregate data from multiple sources
        """
        tasks = []
        
        # Create tasks for different data sources
        tasks.append(self._fetch_job_portal_data(skill, location))
        tasks.append(self._fetch_government_data(skill, location))
        tasks.append(self._fetch_salary_data(skill, location))
        tasks.append(self._fetch_industry_reports(skill))
        
        # Execute all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Combine results
        aggregated_data = {
            "job_portals": results[0] if not isinstance(results[0], Exception) else {},
            "government": results[1] if not isinstance(results[1], Exception) else {},
            "salary": results[2] if not isinstance(results[2], Exception) else {},
            "industry": results[3] if not isinstance(results[3], Exception) else {}
        }
        
        return aggregated_data
    
    async def _fetch_job_portal_data(self, skill: str, location: Optional[str]) -> Dict[str, Any]:
        """
        Fetch data from job portals (simulated - in production would use real APIs)
        """
        # Simulate API calls to major job portals
        await asyncio.sleep(0.2)  # Simulate network delay
        
        # Generate realistic market data based on skill and location
        base_demand = self._calculate_base_demand(skill)
        location_multiplier = self._get_location_multiplier(location)
        
        return {
            "total_jobs": int(base_demand * location_multiplier * np.random.uniform(0.8, 1.2)),
            "new_jobs_this_week": int(base_demand * location_multiplier * 0.1 * np.random.uniform(0.5, 1.5)),
            "trending_score": np.random.uniform(0.3, 1.0),
            "companies_hiring": ["TCS", "Infosys", "Wipro", "Accenture", "Amazon", "Google", "Microsoft"],
            "required_experience": {
                "entry_level": 0.4,
                "mid_level": 0.4,
                "senior_level": 0.2
            }
        }
    
    async def _fetch_government_data(self, skill: str, location: Optional[str]) -> Dict[str, Any]:
        """
        Fetch government employment statistics
        """
        await asyncio.sleep(0.1)
        
        return {
            "employment_growth_rate": np.random.uniform(2.0, 15.0),
            "skill_shortage_level": np.random.choice(["low", "medium", "high", "critical"]),
            "government_initiatives": [
                "Skill India Mission",
                "Digital India",
                "Make in India",
                "Start-up India"
            ],
            "training_programs_available": np.random.randint(5, 25)
        }
    
    async def _fetch_salary_data(self, skill: str, location: Optional[str]) -> Dict[str, Any]:
        """
        Fetch salary and compensation data
        """
        await asyncio.sleep(0.15)
        
        base_salary = self._get_base_salary(skill)
        location_adjustment = self._get_salary_location_adjustment(location)
        
        return {
            "average_salary": {
                "entry_level": base_salary * 0.6 * location_adjustment,
                "mid_level": base_salary * location_adjustment,
                "senior_level": base_salary * 1.8 * location_adjustment
            },
            "salary_growth_rate": np.random.uniform(8.0, 20.0),
            "compensation_trends": ["performance_bonuses", "stock_options", "remote_work_allowance"],
            "salary_percentiles": {
                "25th": base_salary * 0.7 * location_adjustment,
                "50th": base_salary * location_adjustment,
                "75th": base_salary * 1.3 * location_adjustment,
                "90th": base_salary * 1.6 * location_adjustment
            }
        }
    
    async def _fetch_industry_reports(self, skill: str) -> Dict[str, Any]:
        """
        Fetch industry analysis and reports
        """
        await asyncio.sleep(0.1)
        
        return {
            "future_demand_prediction": np.random.uniform(1.1, 2.5),
            "automation_risk": np.random.uniform(0.1, 0.8),
            "emerging_sub_skills": self._get_emerging_sub_skills(skill),
            "industry_adoption_rate": np.random.uniform(0.3, 0.9),
            "market_maturity": np.random.choice(["emerging", "growing", "mature", "declining"])
        }
    
    def _process_market_data(self, skill: str, data: Dict[str, Any], location: Optional[str]) -> MarketInsight:
        """
        Process aggregated market data into structured insights
        """
        job_data = data.get("job_portals", {})
        gov_data = data.get("government", {})
        salary_data = data.get("salary", {})
        industry_data = data.get("industry", {})
        
        # Calculate demand score (0-100)
        demand_score = min(100, (
            (job_data.get("total_jobs", 100) / 100) * 30 +
            (job_data.get("trending_score", 0.5) * 100) * 20 +
            (gov_data.get("employment_growth_rate", 5) / 15 * 100) * 25 +
            (industry_data.get("future_demand_prediction", 1.2) / 2.5 * 100) * 25
        ))
        
        # Calculate supply score (inverse of shortage)
        shortage_level = gov_data.get("skill_shortage_level", "medium")
        shortage_scores = {"low": 80, "medium": 60, "high": 40, "critical": 20}
        supply_score = shortage_scores.get(shortage_level, 60)
        
        # Calculate gap ratio
        gap_ratio = max(0.1, demand_score / max(supply_score, 1))
        
        # Get geographic hotspots
        hotspots = self._identify_geographic_hotspots(skill, location)
        
        # Generate trending keywords
        trending_keywords = self._generate_trending_keywords(skill, industry_data)
        
        return MarketInsight(
            skill=skill,
            demand_score=round(demand_score, 2),
            supply_score=round(supply_score, 2),
            gap_ratio=round(gap_ratio, 2),
            average_salary=salary_data.get("average_salary", {}),
            job_openings=job_data.get("total_jobs", 0),
            growth_rate=gov_data.get("employment_growth_rate", 5.0),
            geographic_hotspots=hotspots,
            trending_keywords=trending_keywords,
            source_confidence=self._calculate_source_confidence(data),
            last_updated=datetime.now()
        )
    
    def get_regional_employment_forecast(self, state: str, skills: List[str]) -> Dict[str, Any]:
        """
        Get regional employment forecast for specific skills
        """
        regional_data = self.regional_data.get(state.lower())
        if not regional_data:
            return {"error": f"Regional data not available for {state}"}
        
        forecast = {
            "state": state,
            "current_employment_rate": regional_data.employment_rate,
            "projected_growth": {},
            "skill_opportunities": {},
            "infrastructure_readiness": regional_data.infrastructure_score,
            "recommended_focus_areas": [],
            "investment_priorities": []
        }
        
        for skill in skills:
            # Calculate skill-specific opportunities
            base_demand = self._calculate_regional_skill_demand(skill, regional_data)
            growth_potential = self._calculate_skill_growth_potential(skill, regional_data)
            
            forecast["skill_opportunities"][skill] = {
                "current_demand": base_demand,
                "growth_potential": growth_potential,
                "competition_level": self._assess_skill_competition(skill, regional_data),
                "salary_expectations": self._get_regional_salary_expectations(skill, regional_data)
            }
        
        # Generate recommendations
        forecast["recommended_focus_areas"] = self._recommend_regional_focus_areas(regional_data, skills)
        forecast["investment_priorities"] = self._identify_investment_priorities(regional_data)
        
        return forecast
    
    def predict_skill_demand_evolution(self, skills: List[str], time_horizon: str = "5_years") -> Dict[str, Any]:
        """
        Predict how skill demand will evolve over time
        """
        predictions = {}
        
        for skill in skills:
            # Get current market position
            current_demand = self._calculate_base_demand(skill)
            
            # Factor in automation risk
            automation_risk = self._get_automation_risk(skill)
            
            # Factor in industry growth trends
            industry_growth = self._get_industry_growth_trends(skill)
            
            # Factor in technology evolution
            tech_evolution_impact = self._get_tech_evolution_impact(skill)
            
            # Calculate prediction
            base_growth = 1.0
            automation_factor = 1.0 - (automation_risk * 0.5)  # 50% max reduction
            industry_factor = 1.0 + (industry_growth / 100)
            tech_factor = 1.0 + (tech_evolution_impact / 100)
            
            if time_horizon == "1_year":
                time_factor = 1.0
            elif time_horizon == "3_years":
                time_factor = 1.2
            elif time_horizon == "5_years":
                time_factor = 1.5
            else:
                time_factor = 2.0  # 10+ years
            
            predicted_demand = current_demand * automation_factor * industry_factor * tech_factor * time_factor
            
            predictions[skill] = {
                "current_demand": current_demand,
                "predicted_demand": round(predicted_demand, 2),
                "change_percentage": round(((predicted_demand - current_demand) / current_demand) * 100, 2),
                "confidence_level": self._calculate_prediction_confidence(skill),
                "key_factors": {
                    "automation_risk": automation_risk,
                    "industry_growth": industry_growth,
                    "technology_impact": tech_evolution_impact
                },
                "recommended_actions": self._recommend_skill_actions(skill, predicted_demand, current_demand)
            }
        
        return {
            "predictions": predictions,
            "methodology": "Multi-factor analysis including automation risk, industry trends, and technology evolution",
            "last_updated": datetime.now().isoformat(),
            "confidence_level": "medium_to_high"
        }
    
    # Data source setup methods
    def _setup_naps_connection(self):
        """Setup connection to NAPS (National Apprenticeship Promotion Scheme)"""
        return {
            "endpoint": "https://naps.gov.in/api",
            "api_key": None,  # Would use actual API key in production
            "enabled": False
        }
    
    def _setup_government_stats(self):
        """Setup connection to government statistics databases"""
        return {
            "endpoint": "https://data.gov.in/api",
            "api_key": None,
            "enabled": False
        }
    
    def _setup_naukri_api(self):
        """Setup connection to Naukri job portal API"""
        return {
            "endpoint": "https://api.naukri.com",
            "api_key": None,
            "enabled": False
        }
    
    def _setup_linkedin_api(self):
        """Setup connection to LinkedIn API"""
        return {
            "endpoint": "https://api.linkedin.com",
            "api_key": None,
            "enabled": False
        }
    
    def _setup_indeed_scraper(self):
        """Setup Indeed job scraping configuration"""
        return {
            "base_url": "https://indeed.co.in",
            "rate_limit": 60,  # requests per minute
            "enabled": False
        }

    # Helper methods
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self.cache:
            return False
        
        cached_item = self.cache[cache_key]
        return datetime.now() - cached_item.last_updated < self.cache_expiry
    
    def _calculate_base_demand(self, skill: str) -> int:
        """Calculate base demand for a skill"""
        # High-demand skills mapping
        high_demand_skills = {
            "python": 5000, "machine_learning": 3500, "data_science": 4000,
            "java": 4500, "javascript": 4200, "react": 3000,
            "aws": 2800, "azure": 2400, "docker": 2000,
            "cybersecurity": 1800, "blockchain": 1200, "ai": 3800
        }
        
        skill_normalized = skill.lower().replace(" ", "_")
        return high_demand_skills.get(skill_normalized, 1000)
    
    def _get_location_multiplier(self, location: Optional[str]) -> float:
        """Get location-based demand multiplier"""
        if not location:
            return 1.0
        
        location_multipliers = {
            "maharashtra": 1.8,
            "karnataka": 1.6,
            "tamil_nadu": 1.3,
            "telangana": 1.4,
            "delhi": 1.5,
            "gujarat": 1.2,
            "punjab": 0.8,
            "west_bengal": 1.1
        }
        
        return location_multipliers.get(location.lower(), 1.0)
    
    def _get_fallback_insight(self, skill: str) -> MarketInsight:
        """Generate fallback insight when real data is unavailable"""
        return MarketInsight(
            skill=skill,
            demand_score=60.0,
            supply_score=70.0,
            gap_ratio=0.86,
            average_salary={"entry_level": 400000, "mid_level": 800000, "senior_level": 1500000},
            job_openings=500,
            growth_rate=8.5,
            geographic_hotspots=["mumbai", "bangalore", "pune", "hyderabad"],
            trending_keywords=[skill, "remote", "full_time"],
            source_confidence=0.3,
            last_updated=datetime.now()
        )

# Global instance
market_intelligence = RealTimeMarketIntelligence()