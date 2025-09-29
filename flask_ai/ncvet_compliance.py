"""
NCVET Compliance Module
Implements NCVET standards and quality assurance measures
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid

class NCVETCompliance:
    """
    Ensures compliance with NCVET (National Council for Vocational Education and Training) standards
    """
    
    def __init__(self):
        self.quality_parameters = self._define_quality_parameters()
        self.assessment_standards = self._define_assessment_standards()
        self.certification_criteria = self._define_certification_criteria()
    
    def _define_quality_parameters(self) -> Dict[str, Any]:
        """Define NCVET quality parameters"""
        return {
            "curriculum_standards": {
                "competency_based": True,
                "industry_aligned": True,
                "outcome_oriented": True,
                "skill_focused": True
            },
            "assessment_quality": {
                "reliable": True,
                "valid": True,
                "fair": True,
                "transparent": True
            },
            "trainer_qualification": {
                "certified": True,
                "experienced": True,
                "updated": True
            },
            "infrastructure": {
                "adequate": True,
                "safe": True,
                "accessible": True
            }
        }
    
    def _define_assessment_standards(self) -> Dict[str, Any]:
        """Define NCVET assessment standards"""
        return {
            "assessment_types": {
                "formative": "Continuous assessment during learning",
                "summative": "Final assessment at course completion",
                "practical": "Hands-on skill demonstration",
                "theoretical": "Knowledge-based evaluation",
                "workplace": "On-job performance assessment"
            },
            "evaluation_criteria": {
                "knowledge": {"weightage": 30, "description": "Theoretical understanding"},
                "skills": {"weightage": 50, "description": "Practical application"},
                "attitude": {"weightage": 20, "description": "Professional behavior"}
            },
            "grading_system": {
                "A+": {"range": "90-100", "grade": "Outstanding"},
                "A": {"range": "80-89", "grade": "Excellent"},
                "B+": {"range": "70-79", "grade": "Very Good"},
                "B": {"range": "60-69", "grade": "Good"},
                "C": {"range": "50-59", "grade": "Satisfactory"},
                "D": {"range": "40-49", "grade": "Needs Improvement"},
                "F": {"range": "0-39", "grade": "Fail"}
            }
        }
    
    def _define_certification_criteria(self) -> Dict[str, Any]:
        """Define NCVET certification criteria"""
        return {
            "certificate_types": {
                "competency_certificate": "Skills-based certification",
                "qualification_certificate": "Level-based certification",
                "micro_credential": "Specific skill certification",
                "recognition_of_prior_learning": "RPL certification"
            },
            "validity_criteria": {
                "minimum_score": 60,
                "practical_assessment": True,
                "attendance_requirement": 75,
                "project_completion": True
            },
            "quality_assurance": {
                "external_verification": True,
                "industry_validation": True,
                "periodic_review": True,
                "standards_compliance": True
            }
        }
    
    def validate_learning_pathway(self, pathway: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate learning pathway against NCVET standards
        
        Args:
            pathway: Learning pathway data
            
        Returns:
            Validation result with compliance status
        """
        validation_result = {
            "is_compliant": True,
            "compliance_score": 0,
            "issues": [],
            "recommendations": [],
            "validated_at": datetime.now().isoformat()
        }
        
        # Check NSQF alignment
        if 'nsqf_level' not in pathway or not pathway['nsqf_level']:
            validation_result["issues"].append("Missing NSQF level alignment")
            validation_result["is_compliant"] = False
        
        # Check competency mapping
        if 'competencies' not in pathway:
            validation_result["issues"].append("Missing competency mapping")
            validation_result["recommendations"].append("Add NSQF-aligned competencies")
        
        # Check assessment strategy
        if 'assessment_plan' not in pathway:
            validation_result["issues"].append("Missing assessment strategy")
            validation_result["recommendations"].append("Include formative and summative assessments")
        
        # Calculate compliance score
        total_checks = 10
        passed_checks = total_checks - len(validation_result["issues"])
        validation_result["compliance_score"] = (passed_checks / total_checks) * 100
        
        return validation_result
    
    def generate_ncvet_certificate(self, 
                                 student_data: Dict[str, Any],
                                 course_data: Dict[str, Any],
                                 assessment_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate NCVET-compliant certificate
        
        Args:
            student_data: Student information
            course_data: Course details
            assessment_results: Assessment scores and results
            
        Returns:
            Certificate data structure
        """
        certificate_id = f"NCVET-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        
        certificate = {
            "certificate_id": certificate_id,
            "type": "NCVET Recognized Certificate",
            "student": {
                "name": student_data.get("name"),
                "id": student_data.get("id"),
                "enrollment_number": student_data.get("enrollment_number")
            },
            "course": {
                "title": course_data.get("title"),
                "nsqf_level": course_data.get("nsqf_level"),
                "sector": course_data.get("sector"),
                "duration": course_data.get("duration")
            },
            "assessment": {
                "overall_score": assessment_results.get("overall_score"),
                "grade": self._calculate_grade(assessment_results.get("overall_score")),
                "practical_score": assessment_results.get("practical_score"),
                "theoretical_score": assessment_results.get("theoretical_score"),
                "competencies_achieved": assessment_results.get("competencies_achieved", [])
            },
            "validation": {
                "issuing_authority": "NCVET Recognized Institution",
                "verification_code": f"VER-{str(uuid.uuid4())[:12].upper()}",
                "issued_date": datetime.now().isoformat(),
                "valid_until": None,  # NCVET certificates typically don't expire
                "qr_code_data": f"https://verify.ncvet.gov.in/{certificate_id}"
            },
            "compliance": {
                "ncvet_approved": True,
                "quality_assured": True,
                "industry_recognized": True
            }
        }
        
        return certificate
    
    def _calculate_grade(self, score: float) -> str:
        """Calculate grade based on NCVET grading system"""
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B+"
        elif score >= 60:
            return "B"
        elif score >= 50:
            return "C"
        elif score >= 40:
            return "D"
        else:
            return "F"
    
    def validate_assessment_plan(self, assessment_plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate assessment plan against NCVET standards
        
        Args:
            assessment_plan: Assessment structure
            
        Returns:
            Validation results
        """
        validation = {
            "is_valid": True,
            "issues": [],
            "suggestions": []
        }
        
        # Check for required assessment types
        required_types = ["theoretical", "practical", "project"]
        for req_type in required_types:
            if req_type not in assessment_plan.get("types", []):
                validation["issues"].append(f"Missing {req_type} assessment")
                validation["is_valid"] = False
        
        # Check weightage distribution
        total_weightage = sum(assessment_plan.get("weightages", {}).values())
        if total_weightage != 100:
            validation["issues"].append(f"Total weightage is {total_weightage}%, should be 100%")
            validation["is_valid"] = False
        
        # Check practical assessment weightage (should be at least 50% for skill courses)
        practical_weightage = assessment_plan.get("weightages", {}).get("practical", 0)
        if practical_weightage < 50:
            validation["suggestions"].append("Consider increasing practical assessment weightage to at least 50%")
        
        return validation
    
    def get_ncvet_quality_metrics(self) -> Dict[str, Any]:
        """
        Get NCVET quality metrics for reporting
        
        Returns:
            Quality metrics structure
        """
        return {
            "quality_parameters": self.quality_parameters,
            "assessment_standards": self.assessment_standards,
            "certification_criteria": self.certification_criteria,
            "compliance_checklist": {
                "curriculum_alignment": "NSQF aligned curriculum",
                "competency_mapping": "Clear competency outcomes",
                "assessment_strategy": "Multi-mode assessment",
                "quality_assurance": "Continuous monitoring",
                "industry_partnership": "Industry validation",
                "trainer_certification": "Qualified instructors",
                "infrastructure_adequacy": "Proper facilities",
                "student_support": "Adequate support services"
            }
        }

# Global instance
ncvet_compliance = NCVETCompliance()