import os
import joblib
import pandas as pd

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error


# Create Required Directories
os.makedirs("data", exist_ok=True)
os.makedirs("models", exist_ok=True)


# Create Dataset (Only Once)
dataset_path = "data/employee_salary.csv"

if not os.path.exists(dataset_path):

    data = {
        "experience": [1, 2, 3, 4, 5, 6, 7, 8],
        "salary": [
            30000,
            40000,
            50000,
            60000,
            70000,
            80000,
            90000,
            100000
        ]
    }

    df = pd.DataFrame(data)
    df.to_csv(dataset_path, index=False)

    print("Dataset Created Successfully!\n")

# Load Dataset
df = pd.read_csv(dataset_path)

print("Employee Salary Dataset\n")
print(df)

# Prepare Features & Target
X = df[["experience"]]
y = df["salary"]

# Train Model
model = LinearRegression()

model.fit(X, y)

print("\nModel Trained Successfully.")

# Evaluate Model
predictions = model.predict(X)

mae = mean_absolute_error(y, predictions)

print(f"Mean Absolute Error (MAE): {mae:.2f}")

# Save Model
model_path = "models/salary_model.pkl"

joblib.dump(model, model_path)

print("Model Saved Successfully.")

# Load Saved Model
loaded_model = joblib.load(model_path)

print("Model Loaded Successfully.")

# User Input
while True:

    try:

        experience = float(
            input("\nEnter Years of Experience: ")
        )

        if experience < 0:
            print("Experience cannot be negative.\n")
            continue

        break

    except ValueError:
        print("Please enter a valid numeric value.\n")


# Prediction
new_employee = pd.DataFrame({
    "experience": [experience]
})

predicted_salary = loaded_model.predict(new_employee)

print("\nPrediction Successful")
print("-" * 35)
print(f"Experience       : {experience:.1f} Years")
print(f"Predicted Salary : ₹{predicted_salary[0]:,.0f}")
print("-" * 35)