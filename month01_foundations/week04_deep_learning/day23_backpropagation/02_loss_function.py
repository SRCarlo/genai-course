import torch
import torch.nn as nn

prediction = torch.tensor([75.0])

actual = torch.tensor([90.0])

loss_fn = nn.MSELoss()

loss = loss_fn(prediction, actual)

print(loss)