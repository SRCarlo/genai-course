import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

model.load_state_dict(
    torch.load("models/student_model.pth")
)

model.eval()

print("Model Loaded Successfully")