inputs = [5]

weights = [0.8]

bias = 1

z = inputs[0] * weights[0] + bias

output = max(0, z)

print(output)