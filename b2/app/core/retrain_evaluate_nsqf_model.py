"""
Retrain and evaluate the NSQF model using all CSVs. Prints accuracy and confusion matrix.
"""
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib
import os
import numpy as np

base_dir = os.path.dirname(__file__)
csv_paths = {
    'skills': os.path.join(base_dir, '../../skills_taxonomy.csv'),
    'quals': os.path.join(base_dir, '../../qualifications.csv'),
    'jobs': os.path.join(base_dir, '../../job_postings.csv'),
    'programs': os.path.join(base_dir, '../../training_programs.csv'),
    'learners': os.path.join(base_dir, '../../learners.csv'),
    'progress': os.path.join(base_dir, '../../learner_progress.csv'),
}

X = []
y = []

skills_df = pd.read_csv(csv_paths['skills'])
if 'skill_name' in skills_df.columns and 'typical_nsqf' in skills_df.columns:
    X.extend(skills_df['skill_name'].astype(str).tolist())
    y.extend(skills_df['typical_nsqf'].astype(str).tolist())
quals_df = pd.read_csv(csv_paths['quals'])
if 'qualification_name' in quals_df.columns and 'nsqf_level' in quals_df.columns:
    X.extend(quals_df['qualification_name'].astype(str).tolist())
    y.extend(quals_df['nsqf_level'].astype(str).tolist())
jobs_df = pd.read_csv(csv_paths['jobs'])
if 'role' in jobs_df.columns and 'nsqf_minimum' in jobs_df.columns:
    X.extend(jobs_df['role'].astype(str).tolist())
    y.extend(jobs_df['nsqf_minimum'].astype(str).tolist())
programs_df = pd.read_csv(csv_paths['programs'])
if 'program_name' in programs_df.columns and 'nsqf_level' in programs_df.columns:
    X.extend(programs_df['program_name'].astype(str).tolist())
    y.extend(programs_df['nsqf_level'].astype(str).tolist())
learners_df = pd.read_csv(csv_paths['learners'])
if 'aspiration' in learners_df.columns and 'aspired_nsqf_level' in learners_df.columns:
    X.extend(learners_df['aspiration'].astype(str).tolist())
    y.extend(learners_df['aspired_nsqf_level'].astype(str).tolist())
progress_df = pd.read_csv(csv_paths['progress'])
if 'recommended_skill_stack' in progress_df.columns and 'placement_likelihood' in progress_df.columns:
    X.extend(progress_df['recommended_skill_stack'].astype(str).tolist())
    binned = (progress_df['placement_likelihood'] * 10).round().astype(int).clip(1, 10).astype(str).tolist()
    y.extend(binned)

if not X or not y:
    raise ValueError("No training data found in the CSV files. Please check the columns.")

# Shuffle and split for evaluation
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = KNeighborsClassifier(n_neighbors=1)
model.fit(X_train_vec, y_train)

# Save model and vectorizer
joblib.dump(model, os.path.join(base_dir, '../data/nsqf_model.joblib'))
joblib.dump(vectorizer, os.path.join(base_dir, '../data/nsqf_vectorizer.joblib'))

# Evaluation
preds = model.predict(X_test_vec)
print("Accuracy:", accuracy_score(y_test, preds))
print("Confusion Matrix:\n", confusion_matrix(y_test, preds))
print("Classification Report:\n", classification_report(y_test, preds))
