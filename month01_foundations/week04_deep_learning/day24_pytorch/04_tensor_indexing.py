import torch

x = torch.tensor([
    [10,20],
    [30,40]
])

print(x[0])

print(x[1])

print(x[0][1])

print(x[:,1])