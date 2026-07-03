# 12_prediction.py

import torch
import torch.nn as nn

# Create the same model architecture
model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

# Load the saved model
model.load_state_dict(
    torch.load("models/simple_model.pth")
)

# Set the model to evaluation mode
model.eval()

# New student data
# Format: [Study Hours, Attendance]
sample = torch.tensor([
    [6., 85.]
])

# Make prediction
with torch.no_grad():
    prediction = model(sample)

print("Prediction:")
print(prediction)