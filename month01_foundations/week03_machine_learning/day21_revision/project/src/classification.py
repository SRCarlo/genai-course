import pandas as pd
from sklearn.linear_model import LogisticRegression

# Load data
data = pd.read_csv("../data/classification_data.csv")

X = data[["Hours", "Attendance"]]
y = data["Pass"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Input
hours = float(input("Study Hours: "))
attendance = float(input("Attendance: "))

# FIX: use DataFrame for prediction
input_data = pd.DataFrame([[hours, attendance]], columns=["Hours", "Attendance"])

result = model.predict(input_data)

if result[0] == 1:
    print("Prediction: PASS")
else:
    print("Prediction: FAIL")