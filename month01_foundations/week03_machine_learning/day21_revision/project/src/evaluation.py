from sklearn.metrics import (
    accuracy_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# Sample values
actual_reg = [50, 60, 70, 80]
pred_reg = [52, 58, 72, 79]

print("----- Regression Metrics -----")
print("MAE :", mean_absolute_error(actual_reg, pred_reg))
print("MSE :", mean_squared_error(actual_reg, pred_reg))
print("R2 Score :", r2_score(actual_reg, pred_reg))

print()

actual_cls = [1, 0, 1, 1, 0]
pred_cls = [1, 0, 1, 0, 0]

print("----- Classification Metrics -----")
print("Accuracy :", accuracy_score(actual_cls, pred_cls))