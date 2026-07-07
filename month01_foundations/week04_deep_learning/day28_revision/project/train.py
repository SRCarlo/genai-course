import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim

from model import StudentModel

# Load Dataset
df = pd.read_csv("data/student_data.csv")

# Features
X = df[["study_hours", "attendance"]].values

# Labels
y = df["pass"].values

# Convert to tensors
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32).view(-1, 1)

# Create model
model = StudentModel()

loss_function = nn.BCELoss()

optimizer = optim.Adam(model.parameters(), lr=0.01)

epochs = 500

print("Training Started...\n")

for epoch in range(epochs):

    prediction = model(X)

    loss = loss_function(prediction, y)

    optimizer.zero_grad()

    loss.backward()

    optimizer.step()

    if (epoch + 1) % 50 == 0:
        print(f"Epoch {epoch+1}/{epochs} Loss = {loss.item():.4f}")

torch.save(model.state_dict(), "models/student_classifier.pth")

print("\nTraining Completed")

print("Model Saved Successfully!")