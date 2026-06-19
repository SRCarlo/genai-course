# Variance

# Measures spread of data.

'''
Low Variance:
20
21
22
23
24

High Variance:
5
20
50
100
200
'''

from statistics import variance

numbers = [10, 20, 30, 40, 50]

print(
    "Varience:",
    variance(numbers)
)
