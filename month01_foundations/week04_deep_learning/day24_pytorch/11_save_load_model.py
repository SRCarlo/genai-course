import torch
import torch.nn as nn

# Define the same model architecture
model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)

# Save the model
torch.save(
    model.state_dict(),
    "models/simple_model.pth"
)

print("Model saved successfully!")


# Load the model
model.load_state_dict(
    torch.load("models/simple_model.pth")
)

# Set the model to evaluation mode
model.eval()

print("Model loaded successfully!")
print("Model is ready for prediction.")