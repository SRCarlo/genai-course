import torch.nn as nn

encoder_layer = nn.TransformerEncoderLayer(
    d_model=16,
    nhead=2
)

print(encoder_layer)