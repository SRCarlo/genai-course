import torch
import torch.nn as nn

embedding = nn.Embedding(
    num_embeddings=100,
    embedding_dim=16
)

tokens = torch.tensor([1,2,3])

output = embedding(tokens)

print(output.shape)