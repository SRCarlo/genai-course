import torch
import torch.nn as nn

mha = nn.MultiheadAttention(
    embed_dim=16,
    num_heads=2,
    batch_first=True
)

x = torch.rand(1,5,16)

output,_ = mha(x,x,x)

print(output.shape)