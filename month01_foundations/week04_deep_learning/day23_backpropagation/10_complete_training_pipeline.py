import os
import torch
import torch.nn as nn
import torch.optim as optim


# Create Model
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


# Dataset
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


# Training
for epoch in range(200):

    optimizer.zero_grad()

    prediction = model(x)

    loss = loss_fn(prediction, y)

    loss.backward()

    optimizer.step()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch {epoch+1:3d} | Loss = {loss.item():.6f}")


# Save
os.makedirs("models", exist_ok=True)

torch.save(
    model.state_dict(),
    "models/student_model.pth"
)

print("\nModel Saved!")


# Load
loaded_model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

loaded_model.load_state_dict(
    torch.load("models/student_model.pth")
)

loaded_model.eval()

print("Model Loaded!")


# Prediction
sample = torch.tensor([[8.0, 92.0]])

with torch.no_grad():
    prediction = loaded_model(sample)

print("\nPrediction:", prediction.item())