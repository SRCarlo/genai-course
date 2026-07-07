import torch
from model import StudentModel

model = StudentModel()

model.load_state_dict(torch.load("models/student_classifier.pth"))
model.eval()

print("Student Performance Predictor\n")

study_hours = float(input("Study Hours: "))
attendance = float(input("Attendance (%): "))

student = torch.tensor([[study_hours, attendance]], dtype=torch.float32)

with torch.no_grad():
    prediction = model(student)
    probability = prediction.item()

if probability >= 0.5:
    print("\nPrediction: PASS")
else:
    print("\nPrediction: FAIL")

print(f"Confidence: {probability:.4f}")