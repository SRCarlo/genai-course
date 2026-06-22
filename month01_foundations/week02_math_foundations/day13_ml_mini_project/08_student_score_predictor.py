def predict_score(hours):
    
    return hours * 10

print("________ Student Predictor __________")

hours = float(input("Study Hours: "))

prediction = (predict_score(hours))

print(f"""Prediction Score: {prediction}""")