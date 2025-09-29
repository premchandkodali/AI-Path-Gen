import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
import joblib
import os

# Path to the new official Excel file
official_xlsx = os.path.join(os.path.dirname(__file__), '../../Qualifications 29-09-2025 09_38_38.xlsx')

# Read the Excel file (assume first sheet, adjust if needed)
df = pd.read_excel(official_xlsx)

# Try to find columns for description/title and NSQF level
desc_col = None
level_col = None
for col in df.columns:
    if 'title' in col.lower() or 'name' in col.lower():
        desc_col = col
    if 'nsqf' in col.lower() and 'level' in col.lower():
        level_col = col

if not desc_col or not level_col:
    raise ValueError(f"Could not find suitable columns in {official_xlsx}. Columns: {df.columns.tolist()}")

X = df[desc_col].astype(str).tolist()
y = df[level_col].astype(str).tolist()

# Vectorize descriptions
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train a simple classifier (KNN for demonstration)
model = KNeighborsClassifier(n_neighbors=1)
model.fit(X_vec, y)

# Save model and vectorizer
joblib.dump(model, os.path.join(os.path.dirname(__file__), '../data/nsqf_model.joblib'))
joblib.dump(vectorizer, os.path.join(os.path.dirname(__file__), '../data/nsqf_vectorizer.joblib'))

print("NSQF model trained and saved from official Excel data.")
