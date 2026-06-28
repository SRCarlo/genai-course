'''
# PRECISION

Question : When the model says YES, how often is it correct?

Formula
        TP
        ------------
        TP + FP

Real Example:
    Spam Detection
        Model says Spam
    
        Was it actually Spam?

                High Precision
                    ↓
                Few False Positives

'''


from sklearn.metrics import precision_score

actual = [1,1,0,1,0]

predicted = [1,1,1,1,0]

precision = precision_score(actual,predicted)

print(precision)