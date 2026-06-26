import pandas as pd

from sklearn.linear_model import (
    LogisticRegression
)

df = pd.read_csv("data/student_pass_fail.csv")

df["result"] = (df["result"] .map({
        "Fail":0,
        "Pass":1
    })
)

X = df[["hours"]]

y = df["result"]

model = LogisticRegression()

model.fit(X,y)

print("Training Complete")