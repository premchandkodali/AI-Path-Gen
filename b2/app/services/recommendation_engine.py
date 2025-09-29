from typing import List, Dict, Any
from app.services.labour_market import get_labour_market_info
from app.models.database import Course, Skill
from sqlalchemy.orm import Session
import requests



def recommend_pathway(profile: Dict[str, Any]) -> Dict[str, Any]:
    import joblib
    import os
    import numpy as np
    prior_skills = profile.get("prior_skills", [])
    aspirations = profile.get("career_aspirations", "")
    learning_pace = profile.get("learning_pace", None)
    digital_access = profile.get("digital_access", None)
    db: Session = profile.get("db")

    # --- NSQF Model Prediction with Error Handling ---
    nsqf_model_path = os.path.join(os.path.dirname(__file__), '../data/nsqf_model.joblib')
    nsqf_vec_path = os.path.join(os.path.dirname(__file__), '../data/nsqf_vectorizer.joblib')
    predicted_nsqf = None
    model = None
    vectorizer = None
    try:
        if os.path.exists(nsqf_model_path) and os.path.exists(nsqf_vec_path):
            model = joblib.load(nsqf_model_path)
            vectorizer = joblib.load(nsqf_vec_path)
            input_text = " ".join([aspirations] + prior_skills)
            X_pred = vectorizer.transform([input_text])
            predicted_nsqf = model.predict(X_pred)[0]
    except Exception as e:
        predicted_nsqf = None

    # --- Pathway Generation Logic ---
    recommended_courses = []
    learning_pathway = []
    fallback_used = False
    # Personalization logic using learning_pace and digital_access
    pace_filter = None
    if learning_pace:
        if learning_pace.lower() == "fast":
            pace_filter = "intensive"
        elif learning_pace.lower() == "slow":
            pace_filter = "self-paced"
    access_filter = None
    if digital_access:
        if digital_access.lower() == "low":
            access_filter = "offline"
        elif digital_access.lower() == "high":
            access_filter = "online"

    if db and predicted_nsqf is not None:
        # Find courses for the predicted NSQF level, filtered by pace and access if possible
        query = db.query(Course).filter(
            Course.description.ilike(f"%NSQF {predicted_nsqf}%") | Course.title.ilike(f"%NSQF {predicted_nsqf}%")
        )
        if pace_filter:
            query = query.filter(Course.description.ilike(f"%{pace_filter}%"))
        if access_filter:
            query = query.filter(Course.description.ilike(f"%{access_filter}%"))
        courses = query.all()
        # If not found, recommend a progression from lower to target NSQF
        if not courses:
            for lvl in range(1, int(predicted_nsqf) + 1):
                step_query = db.query(Course).filter(
                    Course.description.ilike(f"%NSQF {lvl}%") | Course.title.ilike(f"%NSQF {lvl}%")
                )
                if pace_filter:
                    step_query = step_query.filter(Course.description.ilike(f"%{pace_filter}%"))
                if access_filter:
                    step_query = step_query.filter(Course.description.ilike(f"%{access_filter}%"))
                step_courses = step_query.all()
                if step_courses:
                    learning_pathway.append({
                        "nsqf_level": lvl,
                        "courses": [c.title for c in step_courses]
                    })
            if not learning_pathway:
                fallback_used = True
                courses = db.query(Course).all()
                recommended_courses.extend([c.title for c in courses])
        else:
            recommended_courses.extend([c.title for c in courses])
            learning_pathway.append({
                "nsqf_level": predicted_nsqf,
                "courses": [c.title for c in courses]
            })
    elif db and prior_skills:
        fallback_used = True
        for skill in prior_skills:
            skill_obj = db.query(Skill).filter(Skill.name.ilike(f"%{skill}%")).first()
            if skill_obj:
                courses = db.query(Course).join(Course.skills).filter(Skill.id == skill_obj.id)
                if pace_filter:
                    courses = courses.filter(Course.description.ilike(f"%{pace_filter}%"))
                if access_filter:
                    courses = courses.filter(Course.description.ilike(f"%{access_filter}%"))
                courses = courses.all()
                recommended_courses.extend([c.title for c in courses])
        if recommended_courses:
            learning_pathway.append({
                "nsqf_level": "unknown",
                "courses": list(set(recommended_courses))
            })
    else:
        fallback_used = True
        if db:
            courses = db.query(Course).all()
            recommended_courses.extend([c.title for c in courses])
            learning_pathway.append({
                "nsqf_level": "all",
                "courses": [c.title for c in courses]
            })


    # --- Recommend certifications and micro-credentials ---
    recommended_certifications = []
    recommended_micro_credentials = []
    if aspirations and db:
        # Example: fetch certifications and micro-credentials related to aspiration
        certs = db.query(Course).filter(Course.title.ilike(f"%certificate%") | Course.title.ilike(f"%certification%"), Course.description.ilike(f"%{aspirations}%")).all()
        recommended_certifications.extend([c.title for c in certs])
        micros = db.query(Course).filter(Course.title.ilike(f"%micro%") | Course.title.ilike(f"%credential%"), Course.description.ilike(f"%{aspirations}%")).all()
        recommended_micro_credentials.extend([c.title for c in micros])

    # --- On-the-job training ---
    recommended_on_job_training = []
    if db:
        ojt_courses = db.query(Course).filter(Course.title.ilike("%on-the-job%") | Course.description.ilike("%on-the-job%") | Course.title.ilike("%apprenticeship%") | Course.description.ilike("%apprenticeship%"))
        if aspirations:
            ojt_courses = ojt_courses.filter(Course.description.ilike(f"%{aspirations}%"))
        recommended_on_job_training.extend([c.title for c in ojt_courses.all()])

    # --- Labour market info for each skill ---
    labour_market_info = get_labour_market_info(prior_skills)

    # --- Error/Fallback Info ---
    notes = []
    if fallback_used:
        notes.append("Fallback recommendations were used due to missing or insufficient model/course data.")
    if predicted_nsqf is None:
        notes.append("NSQF model could not predict a level for this profile.")

    return {
        "recommended_courses": list(set(recommended_courses)),
        "recommended_certifications": recommended_certifications,
        "recommended_micro_credentials": recommended_micro_credentials,
        "recommended_on_job_training": recommended_on_job_training,
        "labour_market_info": labour_market_info,
        "predicted_nsqf": predicted_nsqf,
        "learning_pathway": learning_pathway,
        "notes": notes
    }

def merge_courses_for_custom_pathway(requested_title: str, db: Session) -> Dict[str, Any]:
    # Example: Find related skills for the requested course
    keywords = requested_title.lower().split()
    related_courses = db.query(Course).filter(
        Course.title.ilike(f"%java%") |
        Course.title.ilike(f"%backend%") |
        Course.title.ilike(f"%frontend%") |
        Course.title.ilike(f"%web%")
    ).all()
    # Merge modules/lessons from found courses
    merged_modules = []
    for course in related_courses:
        if course.syllabus:
            merged_modules.extend(course.syllabus)
    # Fallback if no modules found
    if not merged_modules:
        merged_modules = [
            {"module": "Java Basics", "lessons": ["Java Syntax", "OOP", "Spring Boot"]},
            {"module": "Frontend Basics", "lessons": ["HTML", "CSS", "JavaScript", "React"]},
            {"module": "Database", "lessons": ["SQL", "JPA", "Integration"]}
        ]
    return {
        "custom_pathway_title": requested_title,
        "modules": merged_modules,
        "notes": "This pathway was generated by merging modules from available courses."
    }

def fetch_external_courses(query: str) -> list:
    results = []
    # Example: Coursera API (pseudo-code, replace with real endpoint and API key)
    try:
        coursera_resp = requests.get(f'https://api.coursera.org/api/courses.v1?q=search&query={query}')
        if coursera_resp.ok:
            for course in coursera_resp.json().get('elements', []):
                results.append({
                    'title': course.get('name'),
                    'provider': 'Coursera',
                    'url': f"https://www.coursera.org/learn/{course.get('slug')}"
                })
    except Exception:
        pass
    # Example: Udemy API (pseudo-code, replace with real endpoint and API key)
    try:
        udemy_resp = requests.get(f'https://www.udemy.com/api-2.0/courses/?search={query}')
        if udemy_resp.ok:
            for course in udemy_resp.json().get('results', []):
                results.append({
                    'title': course.get('title'),
                    'provider': 'Udemy',
                    'url': course.get('url')
                })
    except Exception:
        pass
    return results
