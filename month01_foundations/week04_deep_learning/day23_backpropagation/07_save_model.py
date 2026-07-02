import os
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

os.makedirs("models", exist_ok=True)

torch.save(
    model.state_dict(),
    "models/student_model.pth"
)

print("Model Saved")