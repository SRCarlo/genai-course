# Outliers

# Data points very different from others.

data = [
    20,
    22,
    21,
    23,
    24,
    500
]

for number in data:

    if number > 100:
        print("Outlier:", number)