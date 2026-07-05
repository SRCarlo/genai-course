import torch.nn as nn

decoder_layer = nn.TransformerDecoderLayer(
    d_model=16,
    nhead=2
)

print(decoder_layer)