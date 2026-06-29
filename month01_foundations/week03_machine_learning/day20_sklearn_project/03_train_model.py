import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv("data/student_scores.csv")

X = df[["hours"]]
y = df["score"]

model = LinearRegression()

model.fit(X, y)

print("Model Trained Successfully")