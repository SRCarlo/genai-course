from sklearn.metrics import *

import math

actual_cls = [1,1,0,1,0]

pred_cls = [1,1,1,0,0]

print("Classification Metrics")

print("Accuracy :",accuracy_score(actual_cls,pred_cls))

print("Precision :",precision_score(actual_cls,pred_cls))

print("Recall :",recall_score(actual_cls,pred_cls))

print("F1 :",f1_score(actual_cls,pred_cls))

print("\nConfusion Matrix")

print(confusion_matrix(actual_cls,pred_cls))

actual_reg=[50,60,70,80]

pred_reg=[52,58,69,81]

mae=mean_absolute_error(actual_reg,pred_reg)

mse=mean_squared_error(actual_reg,pred_reg)

rmse=math.sqrt(mse)

r2=r2_score(actual_reg,pred_reg)

print("\nRegression Metrics")

print("MAE :",mae)

print("MSE :",mse)

print("RMSE :",rmse)

print("R2 :",r2)