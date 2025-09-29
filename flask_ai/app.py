# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
import re
import logging
from job_stats import get_career_insights as get_job_stats
from nsqf_service import nsqf_service
from ncvet_compliance import ncvet_compliance
from advanced_profiler import advanced_profiler
from market_intelligence import market_intelligence
from multilingual_interface import multilingual_interface, SupportedLanguage, AccessibilityFeature
from advanced_recommendation_engine import advanced_recommendation_engine, RecommendationAlgorithm, PathwayObjective

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Configure the Gemini AI API with your key from the .env file
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("A GEMINI_API_KEY is required in your .env file.")
genai.configure(api_key=gemini_api_key)

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for your React app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize the Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


# --- Helper Functions ---

def extract_json(text: str):
    """
    Safely extracts a JSON object from a string that might contain other text,
    like the markdown formatting from the AI response.
    """
    try:
        # First, try to load the entire string as JSON
        return json.loads(text)
    except json.JSONDecodeError:
        # If that fails, look for a JSON block enclosed in markdown ```json ... ```
        match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        # As a final fallback, find any string between curly braces
        match = re.search(r"(\{.*?\})", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    # If no JSON is found, raise an error
    raise ValueError("No valid JSON was found in the AI's response.")


def split_into_pages(sections, words_per_page=250):
    """
    Splits the sections of a lesson into multiple pages for easier reading
    and better performance on the front-end.
    """
    pages = []
    current_page_sections = []
    current_word_count = 0

    for sec in sections:
        # Calculate the word count of the current section
        sec_text = sec.get("content", "") + " ".join(sec.get("examples", []) + sec.get("steps", []))
        sec_words = len(sec_text.split())

        # If adding this section exceeds the page limit, create a new page
        if current_word_count + sec_words > words_per_page and current_page_sections:
            pages.append({"sections": current_page_sections})
            current_page_sections = []
            current_word_count = 0
        
        current_page_sections.append(sec)
        current_word_count += sec_words

    # Add any remaining sections as the last page
    if current_page_sections:
        pages.append({"sections": current_page_sections})

    return pages


# --- API Endpoints ---

@app.route("/api/career-insights", methods=["GET"])
def get_career_insights_api():
    """
    Gets career insights for a given job title using Gemini AI only.
    """
    job_title = request.args.get('job_title')
    if not job_title:
        return jsonify({"error": "job_title parameter is required"}), 400

    logger.info(f"Fetching career insights for: {job_title}")
    
    try:
        gemini_insights = get_job_stats(job_title)
        
        if gemini_insights is None:
            return jsonify({"error": "Failed to get insights from Gemini AI"}), 500
            
        # Transform Gemini response to match frontend expectations
        formatted_insights = {
            'job_title': job_title,
            'open_positions': int(gemini_insights.get('open_positions_approx_k', 0) * 1000) if gemini_insights.get('open_positions_approx_k') else None,
            'average_salary': f"₹{gemini_insights.get('avg_salary_lpa', 0)} LPA" if gemini_insights.get('avg_salary_lpa') else None,
            'job_growth_yoy': gemini_insights.get('job_growth_percentage_yoy')
        }

        return jsonify(formatted_insights)
    except Exception as e:
        logger.error(f"Error fetching career insights for {job_title}: {e}")
        return jsonify({"error": "Failed to fetch career insights"}), 500

@app.route("/generate-course", methods=["POST"])
def generate_course():
    """
    Generates only the course outline (title and a list of lesson titles with objectives).
    It does NOT generate the full content.
    """
    try:
        data = request.get_json()
        topic = data.get("topic", "An unspecified topic")
        logger.info(f"📚 Received course generation request for topic: '{topic}'")
    except Exception as e:
        logger.error(f"❌ Invalid request body: {e}")
        return jsonify({"error": "Invalid request body"}), 400

    prompt = f"""
    You are an expert course designer. Create a professional course outline for the topic "{topic}".
    Your response must include a main "courseTitle" and a list of 5-7 "lessons".
    Each lesson object in the list must contain a "lessonTitle" and a list of 3-5 learning "objectives".
    Return ONLY a valid JSON object in the following format:
    ```json
    {{
      "courseTitle": "string",
      "lessons": [
        {{
          "lessonTitle": "string",
          "objectives": ["string", "string", "string"]
        }}
      ]
    }}
    ```
    """

    try:
        logger.info("🤖 Sending request to Gemini AI for course generation...")
        response = model.generate_content(prompt)
        logger.info("✅ Received response from Gemini AI")
        logger.info(f"📄 Raw Gemini response length: {len(response.text)} characters")
        
        course_data = extract_json(response.text)
        logger.info(f"✨ Successfully parsed course: '{course_data.get('courseTitle', 'Unknown')}'")
        logger.info(f"📝 Generated {len(course_data.get('lessons', []))} lessons")
        
        return jsonify(course_data)
    except Exception as e:
        logger.error(f"❌ Error in /generate-course: {e}")
        return jsonify({"error": "Failed to generate course from AI model."}), 500


@app.route("/lesson-explanation", methods=["POST"])
def lesson_explanation():
    """
    Generates the detailed, paginated content for a single lesson title provided by the front-end.
    """
    try:
        data = request.get_json()
        lesson_title = data.get("lessonTitle", "An unspecified lesson")
        logger.info(f"📖 Received lesson content request for: '{lesson_title}'")
    except Exception as e:
        logger.error(f"❌ Invalid request body: {e}")
        return jsonify({"error": "Invalid request body"}), 400

    prompt = f"""
    You are a professional teacher. Write a detailed, structured explanation for the lesson titled: "{lesson_title}".
    Break the content down into multiple sections. Each section must have a "title" and "content".
    Where appropriate, a section can also include "examples" (a list of strings), "steps" (a list of strings), or "code" (a single string for a code block).
    The explanation should be clear, comprehensive, and easy to understand.
    Return ONLY a valid JSON object in the format:
    ```json
    {{
        "sections": [
            {{
                "title": "string",
                "content": "string",
                "examples": ["string"],
                "steps": ["string"],
                "code": "string"
            }}
        ]
    }}
    ```
    """

    try:
        logger.info("🤖 Sending request to Gemini AI for lesson content...")
        response = model.generate_content(prompt)
        logger.info("✅ Received response from Gemini AI")
        logger.info(f"📄 Raw Gemini response length: {len(response.text)} characters")
        
        lesson_data = extract_json(response.text)
        
        # Paginate the generated sections before sending to the front-end
        sections = lesson_data.get("sections", [])
        paginated_content = split_into_pages(sections)
        
        logger.info(f"📚 Generated {len(sections)} sections, split into {len(paginated_content)} pages")
        
        return jsonify({"pages": paginated_content})

    except Exception as e:
        logger.error(f"❌ Error in /lesson-explanation: {e}")
        return jsonify({"error": "Failed to generate lesson content from AI model."}), 500


# --- NSQF Endpoints ---

@app.route("/api/nsqf/predict-level", methods=["POST"])
def predict_nsqf_level():
    """
    Predict NSQF level based on user profile
    Expected JSON: {
        "career_aspirations": "string",
        "prior_skills": ["skill1", "skill2"],
        "academic_background": "string"
    }
    """
    try:
        data = request.get_json()
        logger.info(f"🎯 NSQF prediction request received")
        
        predicted_level = nsqf_service.predict_nsqf_level(data)
        
        if predicted_level is None:
            return jsonify({
                "error": "Could not predict NSQF level",
                "level": None
            }), 400
        
        level_info = nsqf_service.get_nsqf_info(predicted_level)
        
        return jsonify({
            "success": True,
            "predicted_level": predicted_level,
            "level_info": level_info
        })
        
    except Exception as e:
        logger.error(f"❌ Error in NSQF prediction: {e}")
        return jsonify({"error": "Failed to predict NSQF level"}), 500


@app.route("/api/nsqf/learning-pathway", methods=["POST"])
def generate_nsqf_pathway():
    """
    Generate personalized learning pathway based on NSQF prediction
    Expected JSON: {
        "career_aspirations": "string",
        "prior_skills": ["skill1", "skill2"],
        "academic_background": "string",
        "learning_pace": "fast|medium|slow",
        "digital_access": "high|medium|low"
    }
    """
    try:
        data = request.get_json()
        logger.info(f"🛤️ Learning pathway generation request")
        
        pathway_data = nsqf_service.generate_learning_pathway(data)
        
        if "error" in pathway_data:
            return jsonify(pathway_data), 400
        
        return jsonify({
            "success": True,
            "pathway": pathway_data
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating learning pathway: {e}")
        return jsonify({"error": "Failed to generate learning pathway"}), 500


@app.route("/api/nsqf/levels", methods=["GET"])
def get_all_nsqf_levels():
    """
    Get information about all NSQF levels
    """
    try:
        levels_data = []
        for level in range(1, 11):
            level_info = nsqf_service.get_nsqf_info(str(level))
            levels_data.append(level_info)
        
        return jsonify({
            "success": True,
            "levels": levels_data
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching NSQF levels: {e}")
        return jsonify({"error": "Failed to fetch NSQF levels"}), 500


@app.route("/api/nsqf/levels/<level>", methods=["GET"])
def get_nsqf_level_info(level):
    """
    Get information about a specific NSQF level
    """
    try:
        level_info = nsqf_service.get_nsqf_info(level)
        
        return jsonify({
            "success": True,
            "level_info": level_info
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching NSQF level {level}: {e}")
        return jsonify({"error": f"Failed to fetch NSQF level {level}"}), 500


# --- NCVET Compliance Endpoints ---

@app.route("/api/ncvet/validate-pathway", methods=["POST"])
def validate_learning_pathway():
    """
    Validate learning pathway against NCVET standards
    """
    try:
        data = request.get_json()
        pathway_data = data.get('pathway', {})
        
        validation_result = ncvet_compliance.validate_learning_pathway(pathway_data)
        
        return jsonify({
            "success": True,
            "validation": validation_result
        })
        
    except Exception as e:
        logger.error(f"❌ Error validating pathway: {e}")
        return jsonify({"error": "Failed to validate learning pathway"}), 500


@app.route("/api/ncvet/generate-certificate", methods=["POST"])
def generate_ncvet_certificate():
    """
    Generate NCVET-compliant certificate
    """
    try:
        data = request.get_json()
        student_data = data.get('student', {})
        course_data = data.get('course', {})
        assessment_results = data.get('assessment', {})
        
        certificate = ncvet_compliance.generate_ncvet_certificate(
            student_data, course_data, assessment_results
        )
        
        return jsonify({
            "success": True,
            "certificate": certificate
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating certificate: {e}")
        return jsonify({"error": "Failed to generate certificate"}), 500


@app.route("/api/ncvet/validate-assessment", methods=["POST"])
def validate_assessment_plan():
    """
    Validate assessment plan against NCVET standards
    """
    try:
        data = request.get_json()
        assessment_plan = data.get('assessment_plan', {})
        
        validation = ncvet_compliance.validate_assessment_plan(assessment_plan)
        
        return jsonify({
            "success": True,
            "validation": validation
        })
        
    except Exception as e:
        logger.error(f"❌ Error validating assessment plan: {e}")
        return jsonify({"error": "Failed to validate assessment plan"}), 500


@app.route("/api/ncvet/quality-metrics", methods=["GET"])
def get_ncvet_quality_metrics():
    """
    Get NCVET quality metrics and standards
    """
    try:
        metrics = ncvet_compliance.get_ncvet_quality_metrics()
        
        return jsonify({
            "success": True,
            "metrics": metrics
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching quality metrics: {e}")
        return jsonify({"error": "Failed to fetch quality metrics"}), 500


# --- Advanced Learner Profiling Endpoints ---

@app.route("/api/profiling/comprehensive-profile", methods=["POST"])
def create_comprehensive_profile():
    """
    Create comprehensive learner profile with advanced analytics
    """
    try:
        data = request.get_json()
        basic_data = data.get('basic_data', {})
        socio_economic = data.get('socio_economic', {})
        psychometric = data.get('psychometric', {})
        accessibility = data.get('accessibility', {})
        
        comprehensive_profile = advanced_profiler.create_comprehensive_profile(
            basic_data, socio_economic, psychometric, accessibility
        )
        
        return jsonify({
            "success": True,
            "profile": comprehensive_profile
        })
        
    except Exception as e:
        logger.error(f"❌ Error creating comprehensive profile: {e}")
        return jsonify({"error": "Failed to create comprehensive profile"}), 500


# --- Real-time Market Intelligence Endpoints ---

@app.route("/api/market/real-time-insights", methods=["POST"])
async def get_real_time_market_insights():
    """
    Get real-time market insights for skills
    """
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        location = data.get('location')
        
        insights = await market_intelligence.get_real_time_market_insights(skills, location)
        
        return jsonify({
            "success": True,
            "insights": {skill: insight.__dict__ for skill, insight in insights.items()}
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting market insights: {e}")
        return jsonify({"error": "Failed to get market insights"}), 500


@app.route("/api/market/regional-forecast", methods=["POST"])
def get_regional_employment_forecast():
    """
    Get regional employment forecast
    """
    try:
        data = request.get_json()
        state = data.get('state', '')
        skills = data.get('skills', [])
        
        forecast = market_intelligence.get_regional_employment_forecast(state, skills)
        
        return jsonify({
            "success": True,
            "forecast": forecast
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting regional forecast: {e}")
        return jsonify({"error": "Failed to get regional forecast"}), 500


@app.route("/api/market/skill-demand-evolution", methods=["POST"])
def predict_skill_demand_evolution():
    """
    Predict skill demand evolution over time
    """
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        time_horizon = data.get('time_horizon', '5_years')
        
        predictions = market_intelligence.predict_skill_demand_evolution(skills, time_horizon)
        
        return jsonify({
            "success": True,
            "predictions": predictions
        })
        
    except Exception as e:
        logger.error(f"❌ Error predicting skill demand: {e}")
        return jsonify({"error": "Failed to predict skill demand"}), 500


# --- Multilingual Interface Endpoints ---

@app.route("/api/multilingual/localized-content", methods=["POST"])
def get_localized_content():
    """
    Get localized and accessibility-adapted content
    """
    try:
        data = request.get_json()
        content_key = data.get('content_key', '')
        language = data.get('language', 'en')
        reading_level = data.get('reading_level', 'intermediate')
        accessibility_features = data.get('accessibility_features', [])
        
        # Convert string to enum
        lang_enum = SupportedLanguage(language)
        access_features = [AccessibilityFeature(feature) for feature in accessibility_features]
        
        localized_content = multilingual_interface.get_localized_content(
            content_key, lang_enum, reading_level, access_features
        )
        
        return jsonify({
            "success": True,
            "content": localized_content
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting localized content: {e}")
        return jsonify({"error": "Failed to get localized content"}), 500


@app.route("/api/multilingual/voice-content", methods=["POST"])
def generate_voice_content():
    """
    Generate voice content with specified settings
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'en')
        voice_settings = data.get('voice_settings', {})
        
        lang_enum = SupportedLanguage(language)
        voice_content = multilingual_interface.generate_voice_content(text, lang_enum, voice_settings)
        
        return jsonify({
            "success": True,
            "voice_content": voice_content
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating voice content: {e}")
        return jsonify({"error": "Failed to generate voice content"}), 500


@app.route("/api/multilingual/accessible-ui-config", methods=["POST"])
def create_accessible_ui_config():
    """
    Create UI configuration based on accessibility and language preferences
    """
    try:
        data = request.get_json()
        accessibility_profile = data.get('accessibility_profile', {})
        language_profile = data.get('language_profile', {})
        
        # Convert to proper data structures (simplified for demo)
        ui_config = multilingual_interface.create_accessible_ui_config(
            accessibility_profile, language_profile
        )
        
        return jsonify({
            "success": True,
            "ui_config": ui_config
        })
        
    except Exception as e:
        logger.error(f"❌ Error creating UI config: {e}")
        return jsonify({"error": "Failed to create UI config"}), 500


@app.route("/api/multilingual/offline-package", methods=["POST"])
def get_offline_support_package():
    """
    Generate offline support package for limited connectivity
    """
    try:
        data = request.get_json()
        language = data.get('language', 'en')
        features = data.get('features', ['translations'])
        
        lang_enum = SupportedLanguage(language)
        package = multilingual_interface.get_offline_support_package(lang_enum, features)
        
        return jsonify({
            "success": True,
            "package": package
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating offline package: {e}")
        return jsonify({"error": "Failed to generate offline package"}), 500


# --- Advanced Recommendation Engine Endpoints ---

@app.route("/api/recommendations/personalized", methods=["POST"])
def generate_personalized_recommendations():
    """
    Generate personalized learning pathway recommendations
    """
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        objectives = data.get('objectives', ['balance_all'])
        algorithm = data.get('algorithm', 'hybrid')
        max_resources = data.get('max_resources', 10)
        
        # Convert strings to enums
        objective_enums = [PathwayObjective(obj) for obj in objectives]
        algorithm_enum = RecommendationAlgorithm(algorithm)
        
        recommendations = advanced_recommendation_engine.generate_personalized_recommendations(
            user_profile, objective_enums, algorithm_enum, max_resources
        )
        
        # Convert result to JSON-serializable format
        result_dict = {
            "pathway_id": recommendations.pathway_id,
            "resources": [resource.__dict__ for resource in recommendations.resources],
            "confidence_score": recommendations.confidence_score,
            "algorithm_used": recommendations.algorithm_used.value,
            "objectives_met": {obj.value: score for obj, score in recommendations.objectives_met.items()},
            "personalization_factors": recommendations.personalization_factors,
            "estimated_outcomes": recommendations.estimated_outcomes,
            "alternative_pathways": recommendations.alternative_pathways
        }
        
        return jsonify({
            "success": True,
            "recommendations": result_dict
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating recommendations: {e}")
        return jsonify({"error": "Failed to generate recommendations"}), 500


@app.route("/api/recommendations/feedback", methods=["POST"])
def update_recommendation_feedback():
    """
    Update recommendation system with user feedback
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id', '')
        resource_id = data.get('resource_id', '')
        feedback = data.get('feedback', {})
        
        advanced_recommendation_engine.update_user_feedback(user_id, resource_id, feedback)
        
        return jsonify({
            "success": True,
            "message": "Feedback updated successfully"
        })
        
    except Exception as e:
        logger.error(f"❌ Error updating feedback: {e}")
        return jsonify({"error": "Failed to update feedback"}), 500


@app.route("/api/recommendations/explanation", methods=["POST"])
def get_recommendation_explanation():
    """
    Get explanation for recommendations
    """
    try:
        data = request.get_json()
        recommendation_result = data.get('recommendation_result', {})
        user_profile = data.get('user_profile', {})
        
        # Convert back to proper format (simplified for demo)
        explanation = {
            "algorithm_rationale": f"Used {recommendation_result.get('algorithm_used', 'hybrid')} algorithm for optimal results",
            "personalization_factors": recommendation_result.get('personalization_factors', {}),
            "skill_alignment": "Resources align with your current skills and career goals",
            "career_relevance": "Selected resources are highly relevant to your career aspirations",
            "market_insights": "Recommendations consider current market demand and trends",
            "learning_path_logic": "Path is structured for progressive skill development"
        }
        
        return jsonify({
            "success": True,
            "explanation": explanation
        })
        
    except Exception as e:
        logger.error(f"❌ Error generating explanation: {e}")
        return jsonify({"error": "Failed to generate explanation"}), 500


# --- Run the Application ---

if __name__ == "__main__":
    # Runs the Flask server on localhost, port 5000
    # The debug=True flag provides detailed error messages and auto-reloads the server when you save changes.
    logger.info("🚀 Starting Flask server on http://localhost:5000")
    logger.info("🔑 Gemini AI configured and ready")
    logger.info("🎯 NSQF service integrated and ready")
    logger.info("🏛️ NCVET compliance module loaded")
    logger.info("👤 Advanced learner profiler initialized")
    logger.info("📊 Real-time market intelligence active")
    logger.info("🌐 Multilingual interface ready")
    logger.info("🤖 Advanced recommendation engine loaded")
    app.run(port=5000, debug=True)