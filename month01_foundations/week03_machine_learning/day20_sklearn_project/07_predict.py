import joblib
import pandas as pd

# Load the trained model
model = joblib.load("models/student_score_model.pkl")

# Get user input
hours = float(input("Study Hours: "))

# Create a DataFrame with the same column name used during training
X_new = pd.DataFrame({"hours": [hours]})

# Make prediction
prediction = model.predict(X_new)

# Display result
print(f"Predicted Score: {prediction[0]:.2f}")