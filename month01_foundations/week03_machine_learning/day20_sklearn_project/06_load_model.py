import joblib

model = joblib.load(
    "models/student_score_model.pkl"
)

print("Model Loaded Successfully")