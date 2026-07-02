import torch
import torch.nn as nn

model = nn.Linear(2, 1)

loss_fn = nn.MSELoss()

x = torch.tensor([[5.0, 80.0]])
y = torch.tensor([[90.0]])

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

print("Gradient Calculated")

print("\nWeight Gradient:")
print(model.weight.grad)

print("\nBias Gradient:")
print(model.bias.grad)