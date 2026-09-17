import joblib

from pathlib import Path


# =========================================================
# 1. LOAD SAVED MODEL
# =========================================================

models_directory = Path(__file__).parent / "models"

model_path = models_directory / "priority_model.pkl"

vectorizer_path = models_directory / "tfidf_vectorizer.pkl"


model = joblib.load(model_path)

vectorizer = joblib.load(vectorizer_path)


print("=" * 60)
print("SURAKSHASETU - ML PRIORITY PREDICTION")
print("=" * 60)

print("\nModel loaded successfully!")
print("TF-IDF vectorizer loaded successfully!")


# =========================================================
# 2. PREDICTION FUNCTION
# =========================================================

def predict_priority(emergency_type, description):

    # Combine emergency type and description
    text = emergency_type + ": " + description

    # Convert text into TF-IDF features
    text_tfidf = vectorizer.transform([text])

    # Predict priority
    prediction = model.predict(text_tfidf)

    return prediction[0]


# =========================================================
# 3. TEST EMERGENCY REPORTS
# =========================================================

test_reports = [

    {
        "emergency_type": "Fire",
        "description": "A small fire started in a kitchen and no one is injured."
    },

    {
        "emergency_type": "Flood",
        "description": "Water is rising rapidly and several families are trapped inside their homes."
    },

    {
        "emergency_type": "Accident",
        "description": "Two cars collided and several people have serious injuries."
    },

    {
        "emergency_type": "Medical",
        "description": "A person is unconscious and not responding and needs immediate medical help."
    },

    {
        "emergency_type": "Crime",
        "description": "An armed attacker is threatening several people near the market."
    },

    {
        "emergency_type": "Earthquake",
        "description": "A major earthquake has collapsed several buildings and people are trapped."
    },

    {
        "emergency_type": "Storm",
        "description": "Strong winds have damaged trees and blocked several roads."
    },

    {
        "emergency_type": "Landslide",
        "description": "A massive landslide has buried vehicles and several people are trapped."
    }

]


# =========================================================
# 4. MAKE PREDICTIONS
# =========================================================

print("\n" + "=" * 60)
print("TEST PREDICTIONS")
print("=" * 60)


for index, report in enumerate(test_reports, start=1):

    priority = predict_priority(
        report["emergency_type"],
        report["description"]
    )

    print(f"\nTest {index}")

    print("Emergency Type:")
    print(report["emergency_type"])

    print("Description:")
    print(report["description"])

    print("Predicted Priority:")
    print(priority)


# =========================================================
# 5. INTERACTIVE PREDICTION
# =========================================================

print("\n" + "=" * 60)
print("INTERACTIVE PREDICTION")
print("=" * 60)

print("\nEnter an emergency report to test the model.")
print("Type 'exit' when you want to stop.")


while True:

    emergency_type = input(
        "\nEnter emergency type: "
    ).strip()

    if emergency_type.lower() == "exit":
        break

    description = input(
        "Enter emergency description: "
    ).strip()

    if description.lower() == "exit":
        break

    priority = predict_priority(
        emergency_type,
        description
    )

    print("\nPredicted Priority:", priority)


print("\nPrediction testing completed.")