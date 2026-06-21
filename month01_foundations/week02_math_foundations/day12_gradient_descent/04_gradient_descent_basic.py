# Simple Gradient Descent

weight = 10

learning_rate = 0.1

for step in range(5):

    gradient = weight
    
    weight = (weight - learning_rate * gradient)
    
    print(f"Step {step+1}: {weight}")