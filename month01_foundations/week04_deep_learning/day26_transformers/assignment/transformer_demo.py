import torch
import torch.nn as nn

# Embedding Layer
embedding = nn.Embedding(
    num_embeddings=100,
    embedding_dim=16
)

tokens = torch.tensor([1, 2, 3, 4, 5])
embedded = embedding(tokens)

print("Embedding Shape:", embedded.shape)

# Multi-Head Attention
attention = nn.MultiheadAttention(
    embed_dim=16,
    num_heads=2,
    batch_first=True
)

x = torch.rand(1, 5, 16)

attention_output, _ = attention(x, x, x)

print("Attention Output Shape:", attention_output.shape)

# Transformer Model
transformer = nn.Transformer(
    d_model=16,
    nhead=2,
    num_encoder_layers=2,
    num_decoder_layers=2,
    batch_first=True
)

src = torch.rand(1, 5, 16)
tgt = torch.rand(1, 5, 16)

output = transformer(src, tgt)

print("Transformer Output Shape:", output.shape)

# Bonus
print("\nBonus: Change nhead=2 to nhead=4 and observe the model.")