from sklearn.metrics import (confusion_matrix)

actual = [ 1,1,0,0]

predicted = [1,0,0,0]

matrix = confusion_matrix(actual,predicted)

print(matrix)