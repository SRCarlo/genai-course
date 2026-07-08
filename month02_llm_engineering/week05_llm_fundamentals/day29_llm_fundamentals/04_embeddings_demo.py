import torch
import torch.nn as nn

embedding = nn.Embedding(50, 8)

tokens = torch.tensor([1, 2, 3])

output = embedding(tokens)

print(output.shape)