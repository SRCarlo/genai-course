import pandas as pd
from sklearn.linear_model import LinearRegression

# Load data
data = pd.read_csv("../data/regression_data.csv")

X = data[["Hours"]]
y = data["Score"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Input
hours = float(input("Enter Study Hours: "))

# FIXED prediction
prediction = model.predict(pd.DataFrame([[hours]], columns=["Hours"]))

print("Predicted Score:", round(prediction[0], 2))