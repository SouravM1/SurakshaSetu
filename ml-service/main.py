from fastapi import FastAPI
from pydantic import BaseModel
import joblib

from pathlib import Path


# =========================================================
# 1. CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="SurakshaSetu ML Service",
    description="AI-based emergency priority prediction service",
    version="1.0.0"
)


# =========================================================
# 2. LOAD SAVED ML MODEL
# =========================================================

models_directory = Path(__file__).parent / "models"

model_path = models_directory / "priority_model.pkl"
vectorizer_path = models_directory / "tfidf_vectorizer.pkl"


model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)


# =========================================================
# 3. REQUEST DATA STRUCTURE
# =========================================================

class EmergencyRequest(BaseModel):

    emergency_type: str
    description: str


# =========================================================
# 4. ROOT ENDPOINT
# =========================================================

@app.get("/")
def home():

    return {
        "message": "SurakshaSetu ML Service is running"
    }


# =========================================================
# 5. HEALTH CHECK ENDPOINT
# =========================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model": "TF-IDF + Linear SVM"
    }


# =========================================================
# 6. PREDICTION ENDPOINT
# =========================================================

@app.post("/predict")
def predict_priority(request: EmergencyRequest):

    # -----------------------------------------------------
    # Combine emergency type and description
    # -----------------------------------------------------

    text = (
        request.emergency_type
        + ": "
        + request.description
    )


    # -----------------------------------------------------
    # Convert text into TF-IDF features
    # -----------------------------------------------------

    text_tfidf = vectorizer.transform([text])


    # -----------------------------------------------------
    # Predict priority
    # -----------------------------------------------------

    prediction = model.predict(text_tfidf)


    priority = prediction[0]


    # -----------------------------------------------------
    # Return prediction
    # -----------------------------------------------------

    return {
        "priority": priority
    }