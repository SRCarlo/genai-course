from sklearn.metrics import r2_score

actual = [50,60,70,80]

predicted = [52,58,69,81]

score = r2_score(actual,predicted)

print(score)