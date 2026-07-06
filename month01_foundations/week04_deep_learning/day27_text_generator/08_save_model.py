import torch
import torch.nn as nn

model = nn.Linear(10, 2)

torch.save(
    model.state_dict(),
    "models/char_model.pth"
)

print("Model Saved")