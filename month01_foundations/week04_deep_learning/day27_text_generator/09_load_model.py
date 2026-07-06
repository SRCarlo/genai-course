import torch
import torch.nn as nn

model = nn.Linear(10, 2)

model.load_state_dict(
    torch.load("models/char_model.pth")
)

model.eval()

print("Model Loaded")