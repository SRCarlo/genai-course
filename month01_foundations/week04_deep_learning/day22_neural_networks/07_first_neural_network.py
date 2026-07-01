import torch
import torch.nn as nn

model = nn.Sequential(

    nn.Linear(2, 4),

    nn.ReLU(),

    nn.Linear(4, 1)

)

print(model)