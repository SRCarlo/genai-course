import torch
import torch.nn as nn

model = nn.Sequential(

    nn.Linear(2, 4),

    nn.ReLU(),

    nn.Linear(4, 1)

)

sample = torch.tensor(
    [[5.0, 80.0]]
)

prediction = model(sample)

print(prediction)