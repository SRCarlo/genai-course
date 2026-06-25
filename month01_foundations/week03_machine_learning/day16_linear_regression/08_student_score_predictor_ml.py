import pandas as pd

from sklearn.linear_model import (
    LinearRegression
)

df = pd.read_csv(
    "data/student_scores.csv"
)

X = df[["hours"]]

y = df["score"]

model = LinearRegression()

model.fit(X, y)

hours = float(
    input(
        "Study Hours: "
    )
)

prediction = model.predict(
    [[hours]]
)

print(
f"""
Predicted Score:

{prediction[0]:.2f}
"""
)