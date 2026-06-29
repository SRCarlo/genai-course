import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression

# Load dataset
df = pd.read_csv("data/student_scores.csv")

# Features and target
X = df[["hours"]]
y = df["score"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "models/student_score_model.pkl")

# Load model
loaded_model = joblib.load("models/student_score_model.pkl")

# User input
hours = float(input("Enter Study Hours: "))

# Create DataFrame with the same column name used during training
X_new = pd.DataFrame({"hours": [hours]})

# Predict
prediction = loaded_model.predict(X_new)

# Display result
print(f"Predicted Score: {prediction[0]:.2f}")