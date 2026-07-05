import torch

x = torch.rand(3,16)

layer = torch.rand(3,16)

output = x + layer

print(output.shape)