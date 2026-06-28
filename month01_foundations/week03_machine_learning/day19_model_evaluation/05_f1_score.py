from sklearn.metrics import f1_score

actual = [1,1,0,1,0]

predicted = [1,1,1,0,0]

score = f1_score(actual,predicted)

print(score)