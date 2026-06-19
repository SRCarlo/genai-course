# Build a Statistics Calculator.

from statistics import (
    mean,
    median,
    mode,
    variance,
    stdev
)

data = [
    10,
    20,
    30,
    40,
    50,
    1000
]

print("Mean:", mean(data))
print("Median:", median(data))
print("Mode:", mode(data))
print("Variance:", variance(data))
print("Standard Deviation:", stdev(data))

for value in data:

    if value > 500:

        print(
            "\nPossible Outlier:",
            value
        )