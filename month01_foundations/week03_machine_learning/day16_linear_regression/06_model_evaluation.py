from sklearn.metrics import (
    mean_absolute_error
)

actual = [80]

predicted = [84]

mae = mean_absolute_error(
    actual,
    predicted
)

print(mae)