import pandas as pd

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("data/student_scores.csv")

X = df[["hours"]]
y = df["score"]

model = LinearRegression()

model.fit(X, y)

predictions = model.predict(X)

mae = mean_absolute_error(y, predictions)

print("MAE:", mae)