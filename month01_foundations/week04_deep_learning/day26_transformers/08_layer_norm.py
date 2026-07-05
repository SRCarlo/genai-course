import torch
import torch.nn as nn

layer_norm = nn.LayerNorm(16)

x = torch.rand(3,16)

print(layer_norm(x))