import torch
import torch.nn as nn

model = nn.Linear(2, 1)

x = torch.tensor([[5.0, 80.0]])

output = model(x)

print(output)