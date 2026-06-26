import pandas as pd
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("data/customer_churn.csv")

# Convert labels to numbers
df["churn"] = df["churn"].map({
    "No": 0,
    "Yes": 1
})

# Features and Target
X = df[["age", "salary"]]
y = df["churn"]

# Train Model
model = LogisticRegression()
model.fit(X, y)

print("___________________ Customer Churn Predictor _____________________")

age = int(input("Enter Customer Age: "))
salary = float(input("Enter Customer Salary: "))

prediction = model.predict([[age, salary]])

print("\nPrediction Result")

if prediction[0] == 1:
    print("Customer Will Leave (Churn)")
else:
    print("Customer Will Stay")