import torch 

embeddings = torch.randn(5,16)

positions = torch.arange(5).unsqueeze(1)

print(positions)