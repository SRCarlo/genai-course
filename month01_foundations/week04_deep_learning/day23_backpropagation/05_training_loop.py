import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Linear(2,1)

loss_fn = nn.MSELoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=0.01
)

for epoch in range(5):

    optimizer.zero_grad()

    x = torch.tensor([[5.0,80.0]])

    y = torch.tensor([[90.0]])

    prediction = model(x)

    loss = loss_fn(prediction,y)

    loss.backward()

    optimizer.step()

    print(
        epoch,
        loss.item()
    )