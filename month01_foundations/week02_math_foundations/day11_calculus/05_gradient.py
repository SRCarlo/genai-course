'''
What is Gradient?

Gradient tells: Which direction reduces error?

Think: Mountain
       Need to reach bottom
       Gradient shows direction

AI Example:

    High Loss
        ↓
    Gradient
        ↓
    Update Model
        ↓
    Lower Loss

''' 
loss = 100

gradient = -5

new_loss = (loss + gradient)

print(new_loss)