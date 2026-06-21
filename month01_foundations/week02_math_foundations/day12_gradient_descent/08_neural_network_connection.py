"""
How Neural Networks Learn

Input
 ↓
Prediction
 ↓
Loss
 ↓
Gradient
 ↓
Weight Update
 ↓
Better Prediction

"""
prediction = 50

target = 100

learning_rate = 0.1

for epoch in range(10):

    error = ( target - prediction)

    prediction += ( learning_rate * error)

    print(f""" Epoch {epoch+1}
               Prediction: {prediction} """)