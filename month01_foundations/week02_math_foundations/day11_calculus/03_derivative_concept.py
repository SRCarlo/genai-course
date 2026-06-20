# Derivative


'''
# Derivative tells: How fast somthing chnages

# Example:

Car Speed
    Position chnages every second
    Derivative = speed

'''

def function(x):
    return x * x

x = 5

approx_derivative = (
    function(x + 1) - function(x)
)

print(approx_derivative)