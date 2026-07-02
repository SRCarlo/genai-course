import os
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim


# Create Neural Network
def create_model():
    model = nn.Sequential(
        nn.Linear(2, 8),
        nn.ReLU(),
        nn.Linear(8, 1)
    )
    return model


# Train Model
def train():

    # Load Dataset
    df = pd.read_csv("../data/student_result.csv")

    x = torch.tensor(
        df[["Hours", "Attendance"]].values,
        dtype=torch.float32
    )

    y = torch.tensor(
        df[["Result"]].values,
        dtype=torch.float32
    )

    model = create_model()

    loss_fn = nn.MSELoss()

    optimizer = optim.Adam(
        model.parameters(),
        lr=0.01
    )

    epochs = 200

    print("Training Started...\n")

    for epoch in range(epochs):

        optimizer.zero_grad()

        prediction = model(x)

        loss = loss_fn(prediction, y)

        loss.backward()

        optimizer.step()

        if (epoch + 1) % 20 == 0:
            print(
                f"Epoch {epoch+1:3d} | Loss = {loss.item():.6f}"
            )

    os.makedirs("models", exist_ok=True)

    torch.save(
        model.state_dict(),
        "models/student_model.pth"
    )

    print("\nModel Saved Successfully!\n")



# Predict
def predict(hours, attendance):

    model = create_model()

    model.load_state_dict(
        torch.load("models/student_model.pth")
    )

    model.eval()

    sample = torch.tensor(
        [[hours, attendance]],
        dtype=torch.float32
    )

    with torch.no_grad():
        prediction = model(sample)

    score = prediction.item()

    print("--------------------------------")
    print(f"Hours       : {hours}")
    print(f"Attendance  : {attendance}")
    print(f"Score       : {score:.4f}")

    if score >= 0.5:
        print("Prediction  : PASS")
    else:
        print("Prediction  : FAIL")


# Main Program
if __name__ == "__main__":

    train()

    print("\nTesting Model...\n")

    predict(8, 92)