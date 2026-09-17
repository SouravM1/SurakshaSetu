import pandas as pd
from pathlib import Path


# ---------------------------------------------------------
# LOAD DATASET
# ---------------------------------------------------------

dataset_path = Path(__file__).parent / "dataset" / "emergencies.csv"

df = pd.read_csv(dataset_path)


# ---------------------------------------------------------
# BASIC INFORMATION
# ---------------------------------------------------------

print("=" * 50)
print("DATASET QUALITY CHECK")
print("=" * 50)

print("\nDataset shape:")
print(df.shape)


print("\nColumns:")
print(df.columns.tolist())


# ---------------------------------------------------------
# MISSING VALUES
# ---------------------------------------------------------

print("\nMissing values:")
print(df.isnull().sum())


# ---------------------------------------------------------
# DUPLICATE ROWS
# ---------------------------------------------------------

print("\nDuplicate rows:")
print(df.duplicated().sum())


# ---------------------------------------------------------
# PRIORITY DISTRIBUTION
# ---------------------------------------------------------

print("\nPriority distribution:")
print(df["priority"].value_counts())


# ---------------------------------------------------------
# EMERGENCY TYPE DISTRIBUTION
# ---------------------------------------------------------

print("\nEmergency type distribution:")
print(df["emergency_type"].value_counts())


# ---------------------------------------------------------
# UNIQUE PRIORITIES
# ---------------------------------------------------------

print("\nUnique priorities:")
print(df["priority"].unique())


# ---------------------------------------------------------
# UNIQUE EMERGENCY TYPES
# ---------------------------------------------------------

print("\nUnique emergency types:")
print(df["emergency_type"].unique())


# ---------------------------------------------------------
# DESCRIPTION LENGTH
# ---------------------------------------------------------

df["description_length"] = df["description"].str.len()

print("\nDescription length statistics:")
print(df["description_length"].describe())


# ---------------------------------------------------------
# SHORTEST DESCRIPTIONS
# ---------------------------------------------------------

print("\nShortest descriptions:")

shortest = df.nsmallest(5, "description_length")

for _, row in shortest.iterrows():
    print(
        f"- [{row['priority']}] "
        f"{row['description']}"
    )


# ---------------------------------------------------------
# LONGEST DESCRIPTIONS
# ---------------------------------------------------------

print("\nLongest descriptions:")

longest = df.nlargest(5, "description_length")

for _, row in longest.iterrows():
    print(
        f"- [{row['priority']}] "
        f"{row['description']}"
    )


# ---------------------------------------------------------
# FINAL CHECK
# ---------------------------------------------------------

print("\n" + "=" * 50)
print("QUALITY CHECK COMPLETED")
print("=" * 50)