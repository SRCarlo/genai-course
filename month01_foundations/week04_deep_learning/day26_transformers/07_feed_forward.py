import torch.nn as nn

ffn = nn.Sequential(

    nn.Linear(16,64),

    nn.ReLU(),

    nn.Linear(64,16)

)

print(ffn)