import os
import logging
from dotenv import load_dotenv
import json
import google.generativeai as genai

# ==============================================================================
# SCRIPT DESCRIPTION
# This is the final, simplified script. It uses ONLY the Gemini API to get 
# estimated career insights for the Indian market, formatted as a JSON object.
# It does not use SerpApi or any CSV files.
# ==============================================================================

# --- Load Environment Variables and Configure APIs ---
load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using Gemini 2.0 Flash Experimental for best analysis capabilities
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
    logging.info("Gemini AI client configured with gemini-2.0-flash-exp model successfully.")
else:
    gemini_model = None
    logging.warning("GEMINI_API_KEY not found in .env file. AI analysis will be disabled.")

# ==============================================================================
# Main Function to Get All Insights Directly from Gemini
# ==============================================================================

def get_career_insights(job_title: str) -> dict | None:
    """
    Asks Gemini to act as a career analyst and provide a complete set of estimated 
    market data for a specific job title in India.
    """
    if not gemini_model:
        logging.error("Gemini client is not configured.")
        return None

    logging.info(f"Querying Gemini for all career insights on '{job_title}' in India...")
    
    # Enhanced prompt for more accurate Indian market analysis
    prompt = f"""
    You are an expert career market analyst specializing in the Indian IT and professional job market. 
    
    Analyze the job title: "{job_title}" and provide realistic market data for India in 2024-2025.
    
    Consider current Indian market conditions, including:
    - Major Indian cities (Mumbai, Bangalore, Hyderabad, Chennai, Pune, Delhi NCR)
    - Indian salary standards and cost of living
    - Current IT industry growth trends in India
    - Remote work impact on Indian job market
    - Skills demand in Indian companies
    
    Return ONLY a valid JSON object with exactly these three keys:
    1. "avg_salary_lpa": Average salary in Lakhs Per Annum (realistic for Indian market)
    2. "open_positions_approx_k": Approximate open positions in thousands across India
    3. "job_growth_percentage_yoy": Year-over-year growth percentage (can be negative)
    
    Example format:
    {{
      "avg_salary_lpa": 7.2,
      "open_positions_approx_k": 12.5,
      "job_growth_percentage_yoy": 18
    }}
    
    Respond with ONLY the JSON object, no other text.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        # Clean the response text to ensure it's a valid JSON string
        json_text = response.text.strip().replace("```json", "").replace("```", "")
        
        # Parse the JSON string into a Python dictionary
        insights = json.loads(json_text)
        return insights

    except json.JSONDecodeError:
        logging.error("Failed to decode JSON from Gemini's response.")
        logging.error(f"Received malformed text: {response.text}")
        return None
    except Exception as e:
        logging.error(f"An error occurred while calling the Gemini API: {e}")
        return None

# ==============================================================================
# Example of how to run this script (for testing)
# ==============================================================================

if __name__ == "__main__":
    # In your Flask app, you would import and call `get_career_insights`.
    # For testing, we call it directly here.
    
    # You can now delete the 'job_trends.csv' file as it is no longer needed.
    
    # Test with a dynamic job title (you can change this for testing different roles)
    import sys
    if len(sys.argv) > 1:
        target_role = " ".join(sys.argv[1:])  # Allow job titles with spaces
    else:
        target_role = "Data Scientist"  # Default for testing
    
    insights = get_career_insights(target_role)
    
    print("\n" + "="*50)
    print(f"      GEMINI'S CAREER INSIGHTS: {target_role}")
    print("="*50)
    
    if insights:
        salary = insights.get('avg_salary_lpa')
        positions = insights.get('open_positions_approx_k')
        growth = insights.get('job_growth_percentage_yoy')

        print(f"Avg Salary:       {salary} LPA (est.)" if salary is not None else "Avg Salary:       N/A")
        print(f"Open Positions:   ~{positions}k (est.)" if positions is not None else "Open Positions:   N/A")
        print(f"Job Growth (YoY): +{growth}% (est.)" if growth is not None else "Job Growth (YoY): N/A")
    else:
        print("Could not retrieve insights for this role.")
        
    print("="*50)