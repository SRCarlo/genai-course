import pandas as pd
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("data/student_pass_fail.csv")

# Convert text labels into numbers
# Fail -> 0, Pass -> 1
df["result"] = df["result"].map({
    "Fail": 0,
    "Pass": 1
})

# Input feature (hours studied)
X = df[["hours"]]

# Output label (result)
y = df["result"]

# Create model
model = LogisticRegression()

# Train model
model.fit(X, y)

# Take user input
hours = float(input("Study Hours: "))

# Predict result (must use same column name as training)
prediction = model.predict(pd.DataFrame([[hours]], columns=["hours"]))

# Convert prediction into readable output
if prediction[0] == 1:
    print("PASS")
else:
    print("FAIL")