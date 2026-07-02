import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Linear(2,1)

optimizer = optim.Adam(
    model.parameters(),
    lr=0.01
)

print(optimizer)