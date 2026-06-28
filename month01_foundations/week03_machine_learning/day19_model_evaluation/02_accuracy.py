'''
# ACCURACY

    Formula
            Correct Predictions
            -------------------
            Total Predictions

Example
    10 Predictions 
    9 Correct

Accuracy = 90%

'''


from sklearn.metrics import accuracy_score

actual = [1,1,0,1,0]

predicted = [1,1,0,0,0]

accuracy = accuracy_score(actual, predicted)

print(f"Accuracy : {accuracy:.2f}")