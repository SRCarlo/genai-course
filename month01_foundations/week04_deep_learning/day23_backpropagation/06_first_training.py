import os
import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

loss_fn = nn.MSELoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=0.01
)

x = torch.tensor([
    [2.0, 70.0],
    [5.0, 80.0],
    [7.0, 90.0]
])

y = torch.tensor([
    [0.0],
    [1.0],
    [1.0]
])

for epoch in range(100):

    optimizer.zero_grad()

    prediction = model(x)

    loss = loss_fn(prediction, y)

    loss.backward()

    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1:3d} | Loss = {loss.item():.6f}")

os.makedirs("models", exist_ok=True)

torch.save(
    model.state_dict(),
    "models/student_model.pth"
)

print("\nModel Saved Successfully!")