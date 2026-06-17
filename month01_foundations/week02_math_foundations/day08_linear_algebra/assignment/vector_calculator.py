"""
Day 8 Assignment Vector Calculator

Operations:
    1. Vector Addition
    2. Vector Subtraction
    3. Dot Product
    
"""

# Vectors

v1 = [1, 2]
v2 = [3, 4]


# Vector Addition
addition = [
    v1[0] + v2[0],
    v1[1] + v2[1]
]

# Vector Subtraction
subtraction = [
    v1[0] - v2[0],
    v1[1] - v2[1]
]

# Dot Product
dot_product = (
    v1[0] * v2[0]
) + (
    v1[1] * v2[1]
)

print("Vector 1:", v1)
print("Vector 2:", v2)

print("\nAddition:", addition)
print("Subtraction:", subtraction)
print("Dot Product:", dot_product)