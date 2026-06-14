# LIST COMPREHENSION
        # Traditional:
numbers = []
for num in range(5):
    numbers.append(num)

# -----------------

# Pythonic 
numbers = [num for num in range(5)]
print(numbers)  # [0, 1, 2, 3, 4]

# Square Numbers
squares = [num * num for num in range(5)]
print(squares)