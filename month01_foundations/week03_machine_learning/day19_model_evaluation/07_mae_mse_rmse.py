from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error

import math

actual = [50,60,70,80]

predicted = [52,58,69,81]

mae = mean_absolute_error(actual,predicted)

mse = mean_squared_error(actual,predicted)

rmse = math.sqrt(mse)

print("MAE :",mae)

print("MSE :",mse)

print("RMSE :",rmse)