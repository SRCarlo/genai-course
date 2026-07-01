# Simple Neural Network using PyTorch

import torch
import torch.nn as nn

# Create Neural Network
model = nn.Sequential(
    nn.Linear(2, 4),   # Input Layer (2 inputs) -> Hidden Layer (4 neurons)
    nn.ReLU(),         # Activation Function
    nn.Linear(4, 1)    # Hidden Layer -> Output Layer (1 output)
)

# Print Model Architecture
print("Neural Network Architecture:\n")
print(model)

# Sample Input
# Study Hours = 6
# Attendance = 90%
sample = torch.tensor([[6.0, 90.0]])

# Make Prediction
prediction = model(sample)

print("\nSample Input:")
print(sample)

print("\nPrediction:")
print(prediction)

# Bonus: Hidden Layer with 8 Neurons

print("\nBonus Model:\n")

bonus_model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

print(bonus_model)