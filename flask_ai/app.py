# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
import re
import logging

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


# --- Run the Application ---

if __name__ == "__main__":
    # Runs the Flask server on localhost, port 5000
    # The debug=True flag provides detailed error messages and auto-reloads the server when you save changes.
    logger.info("🚀 Starting Flask server on http://localhost:5000")
    logger.info("🔑 Gemini AI configured and ready")
    app.run(port=5000, debug=True)