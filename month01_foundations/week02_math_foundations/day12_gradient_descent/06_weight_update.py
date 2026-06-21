"""
Weight Update Formula : 

New Weight = Old Weight - Learning Rate × Gradient

"""

weight = 20

gradient = 5

learning_rate = 0.1

weight = (
    weight -
    learning_rate * gradient
)

print(weight)