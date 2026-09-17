import pandas as pd

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# =========================================================
# 1. LOAD DATASET
# =========================================================

dataset_path = Path(__file__).parent / "dataset" / "emergencies.csv"

df = pd.read_csv(dataset_path)

print("=" * 60)
print("STEP 12 - ML MODEL TRAINING")
print("=" * 60)

print("\nDataset shape:")
print(df.shape)


# =========================================================
# 2. CREATE INPUT TEXT
# =========================================================
#
# We combine:
#
# emergency_type + description
#
# Example:
#
# Fire: A large fire is spreading rapidly near the highway.
#
# This combined text will be given to TF-IDF.
# =========================================================

df["text"] = (
    df["emergency_type"]
    + ": "
    + df["description"]
)


# =========================================================
# 3. INPUT (X) AND TARGET (y)
# =========================================================

X = df["text"]

y = df["priority"]


print("\nInput examples:")

for i in range(3):
    print(f"\nExample {i + 1}:")
    print(X.iloc[i])
    print("Priority:", y.iloc[i])


# =========================================================
# 4. TRAIN / TEST SPLIT
# =========================================================
#
# 80% → Training
# 20% → Testing
#
# stratify=y keeps the priority classes balanced.
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\n" + "=" * 60)
print("TRAIN / TEST SPLIT")
print("=" * 60)

print("\nTraining samples:")
print(len(X_train))

print("\nTesting samples:")
print(len(X_test))


print("\nTraining priority distribution:")
print(y_train.value_counts())

print("\nTesting priority distribution:")
print(y_test.value_counts())


# =========================================================
# 5. TF-IDF VECTORIZATION
# =========================================================
#
# TF-IDF converts text into numerical features.
#
# The model cannot directly understand:
#
# "large fire spreading rapidly"
#
# TF-IDF converts the text into numbers.
# =========================================================

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=5000
)


# IMPORTANT:
#
# fit_transform ONLY on training data.
#
# This prevents information from the test set
# leaking into the training process.

X_train_tfidf = vectorizer.fit_transform(X_train)


# Transform test data using the SAME vectorizer.

X_test_tfidf = vectorizer.transform(X_test)


print("\n" + "=" * 60)
print("TF-IDF")
print("=" * 60)

print("\nTraining TF-IDF shape:")
print(X_train_tfidf.shape)

print("\nTesting TF-IDF shape:")
print(X_test_tfidf.shape)


# =========================================================
# 6. CREATE LINEAR SVM MODEL
# =========================================================

model = LinearSVC(
    C=1.0,
    random_state=42
)


# =========================================================
# 7. TRAIN MODEL
# =========================================================

print("\n" + "=" * 60)
print("TRAINING LINEAR SVM")
print("=" * 60)

model.fit(
    X_train_tfidf,
    y_train
)

print("\nModel training completed!")


# =========================================================
# 8. MAKE PREDICTIONS
# =========================================================

y_pred = model.predict(X_test_tfidf)


# =========================================================
# 9. MODEL ACCURACY
# =========================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n" + "=" * 60)
print("MODEL PERFORMANCE")
print("=" * 60)

print(f"\nAccuracy: {accuracy:.4f}")

print(f"Accuracy percentage: {accuracy * 100:.2f}%")


# =========================================================
# 10. CLASSIFICATION REPORT
# =========================================================

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred
    )
)


# =========================================================
# 11. CONFUSION MATRIX
# =========================================================

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# =========================================================
# 12. TEST SOME NEW EMERGENCY REPORTS
# =========================================================

sample_reports = [
    "Fire: A small fire was noticed in a building. No injuries reported.",
    "Flood: Water is rising rapidly and several families are trapped inside their homes.",
    "Accident: Two vehicles had a minor collision. No serious injuries.",
    "Medical: A person is unconscious and not responding. Immediate medical help is needed.",
    "Crime: An armed attacker is threatening people near the market.",
    "Earthquake: A major earthquake has collapsed buildings and people are trapped.",
    "Storm: Strong winds have damaged some trees and roads.",
    "Landslide: A massive landslide has buried vehicles and people are trapped.",
]


sample_tfidf = vectorizer.transform(
    sample_reports
)

sample_predictions = model.predict(
    sample_tfidf
)


print("\n" + "=" * 60)
print("SAMPLE PREDICTIONS")
print("=" * 60)

for report, prediction in zip(
    sample_reports,
    sample_predictions
):

    print("\nReport:")
    print(report)

    print("Predicted Priority:")
    print(prediction)


# =========================================================
# 13. SAVE MODEL AND VECTORIZER
# =========================================================

import joblib


models_directory = Path(__file__).parent / "models"

models_directory.mkdir(
    exist_ok=True
)


model_path = models_directory / "priority_model.pkl"

vectorizer_path = models_directory / "tfidf_vectorizer.pkl"


joblib.dump(
    model,
    model_path
)


joblib.dump(
    vectorizer,
    vectorizer_path
)


print("\n" + "=" * 60)
print("MODEL SAVING")
print("=" * 60)

print("\nModel saved to:")
print(model_path)

print("\nTF-IDF vectorizer saved to:")
print(vectorizer_path)


print("\n" + "=" * 60)
print("ML TRAINING COMPLETED SUCCESSFULLY")
print("=" * 60)