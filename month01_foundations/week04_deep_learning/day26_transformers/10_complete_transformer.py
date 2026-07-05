import torch
import torch.nn as nn

model = nn.Transformer(

    d_model=16,

    nhead=2,

    num_encoder_layers=2,

    num_decoder_layers=2,

    batch_first=True

)

src = torch.rand(1,5,16)

tgt = torch.rand(1,5,16)

output = model(src,tgt)

print(output.shape)