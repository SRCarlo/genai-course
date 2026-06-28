from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

import pandas as pd
import math


# Load Classification Dataset
def classification_metrics():
    try:
        df = pd.read_csv("../data/classification_data.csv")

        actual = df["actual"]
        predicted = df["predicted"]

        print("\n ____________________ CLASSIFICATION METRICS ____________________\n")

        accuracy = accuracy_score(actual, predicted)
        precision = precision_score(actual, predicted)
        recall = recall_score(actual, predicted)
        f1 = f1_score(actual, predicted)
        matrix = confusion_matrix(actual, predicted)

        print(f"Accuracy          : {accuracy:.2f}")
        print(f"Precision         : {precision:.2f}")
        print(f"Recall            : {recall:.2f}")
        print(f"F1 Score          : {f1:.2f}")

        print("\nConfusion Matrix")
        print(matrix)

    except FileNotFoundError:
        print("\nclassification_data.csv not found!\n")



# Load Regression Dataset
def regression_metrics():
    try:
        df = pd.read_csv("../data/regression_data.csv")

        actual = df["actual"]
        predicted = df["predicted"]

        print("\n ____________________ REGRESSION METRICS  ____________________\n")

        mae = mean_absolute_error(actual, predicted)
        mse = mean_squared_error(actual, predicted)
        rmse = math.sqrt(mse)
        r2 = r2_score(actual, predicted)

        print(f"MAE               : {mae:.2f}")
        print(f"MSE               : {mse:.2f}")
        print(f"RMSE              : {rmse:.2f}")
        print(f"R² Score          : {r2:.2f}")

    except FileNotFoundError:
        print("\nregression_data.csv not found!\n")


# Dashboard
while True:

    print("\n ___________________ MODEL METRICS DASHBOARD ___________\n")
    print("1. Classification Metrics")
    print("2. Regression Metrics")
    print("3. Exit")

    choice = input("\nEnter Choice : ")

    if choice == "1":
        classification_metrics()

    elif choice == "2":
        regression_metrics()

    elif choice == "3":
        print("\nThank You!")
        break

    else:
        print("\nInvalid Choice!")