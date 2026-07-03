import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Sequential(

    nn.Linear(2,8),

    nn.ReLU(),

    nn.Linear(8,1)

)

loss_fn = nn.MSELoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=0.001
)

x = torch.tensor([
    [2.,70.],
    [5.,80.],
    [7.,90.]
])

y = torch.tensor([
    [0.],
    [1.],
    [1.]
])

for epoch in range(100):

    optimizer.zero_grad()

    prediction = model(x)

    loss = loss_fn(prediction,y)

    loss.backward()

    optimizer.step()

print(loss.item())