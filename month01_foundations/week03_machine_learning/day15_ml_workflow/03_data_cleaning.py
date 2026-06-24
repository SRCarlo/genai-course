'''
Why Data Cleaning?

Real data contains:
        Missing Values
        Duplicates
        Wrong Values
        Invalid Data

Bad Data:
    Hours = abc
    Score = ?

Good Data:
    Hours = 5
    Score = 50

'''

data = [10, 20, None, 40, 50]

cleaned = []

for value in data:

    if value is not None:
        cleaned.append(value)

print(cleaned)