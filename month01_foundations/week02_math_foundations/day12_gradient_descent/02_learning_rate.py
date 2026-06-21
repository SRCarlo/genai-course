'''
What is Learning Rate: Learning Rate controls step size.

Formula:

New Weight = Old Weight - (Learning Rate × Gradient)

'''
weight = 10

gradient = 2

learning_rate = 0.1

new_weight = (weight - learning_rate * gradient)

print(new_weight)