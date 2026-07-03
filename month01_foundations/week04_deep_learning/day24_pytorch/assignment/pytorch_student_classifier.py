import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# Device Configuration

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)


# Create models folder
os.makedirs("models", exist_ok=True)

# Custom Dataset
class StudentDataset(Dataset):

    def __init__(self):
        self.features = torch.tensor([
            [2., 70.],
            [3., 75.],
            [5., 80.],
            [6., 85.],
            [7., 90.],
            [8., 95.]
        ], dtype=torch.float32)

        self.labels = torch.tensor([
            [0.],
            [0.],
            [1.],
            [1.],
            [1.],
            [1.]
        ], dtype=torch.float32)

    def __len__(self):
        return len(self.features)

    def __getitem__(self, index):
        return self.features[index], self.labels[index]


dataset = StudentDataset()

loader = DataLoader(
    dataset,
    batch_size=2,
    shuffle=True
)


# Custom Neural Network
class StudentNN(nn.Module):

    def __init__(self):
        super().__init__()

        self.network = nn.Sequential(
            nn.Linear(2, 8),
            nn.ReLU(),
            nn.Linear(8, 1)
        )

    def forward(self, x):
        return self.network(x)


model = StudentNN().to(device)


# Loss & Optimizer
loss_fn = nn.MSELoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=0.001
)


# Training
epochs = 200

for epoch in range(epochs):

    model.train()

    total_loss = 0

    for inputs, labels in loader:

        inputs = inputs.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(inputs)

        loss = loss_fn(outputs, labels)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch [{epoch+1}/{epochs}] Loss: {total_loss:.4f}")

# Save Model
torch.save(
    model.state_dict(),
    "models/student_model.pth"
)

print("\nModel saved successfully!")


# Load Model
loaded_model = StudentNN().to(device)

loaded_model.load_state_dict(
    torch.load("models/student_model.pth")
)

loaded_model.eval()

print("Model loaded successfully!")


# Prediction
sample = torch.tensor([
    [6., 85.]
], dtype=torch.float32).to(device)

with torch.no_grad():

    prediction = loaded_model(sample)

predicted_class = 1 if prediction.item() >= 0.5 else 0

print("\nStudy Hours :", sample[0][0].item())
print("Attendance  :", sample[0][1].item())

print("Raw Output  :", prediction.item())

if predicted_class == 1:
    print("Prediction  : PASS")
else:
    print("Prediction  : FAIL")