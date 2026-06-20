# Mini AI Training Example

target = 100

prediction = 50

for epoch in range(10):

    error = target - prediction

    prediction += error * 0.1

    print(
        f"""
Epoch: {epoch+1}
Prediction: {prediction}
Error: {error}
        """
    )