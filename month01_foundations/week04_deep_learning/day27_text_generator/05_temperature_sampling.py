import torch

logits = torch.tensor([2.0, 1.0, 0.5])

temperature = 0.7

probabilities = torch.softmax(
    logits / temperature,
    dim=0
)

print(probabilities)