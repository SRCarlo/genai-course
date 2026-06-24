'''
Why Split Data?
    Never train on all data.

Standard:
    80% Training
    20% Testing

Visual:
    100 Records
    80 Train
    20 Test
    
'''

data = list(range(100))

split = int(len(data) * 0.8)

train = data[:split]

test = data[split:]

print(len(train))

print(len(test))