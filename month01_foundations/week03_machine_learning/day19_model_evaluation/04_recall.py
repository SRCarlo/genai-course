from sklearn.metrics import recall_score

actual = [1,1,1,0,0]

predicted = [1,0,1,0,0]

recall = recall_score(actual,predicted)

print(recall)