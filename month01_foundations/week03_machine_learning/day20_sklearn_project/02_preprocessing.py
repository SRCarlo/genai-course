import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("data/student_scores.csv")

X = df[["hours"]]
y = df["score"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Training Data:", len(X_train))
print("Testing Data:", len(X_test))