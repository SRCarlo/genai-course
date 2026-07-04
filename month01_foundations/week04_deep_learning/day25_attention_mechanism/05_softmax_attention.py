import torch

scores = torch.tensor([2.1, 4.5, 1.2])

weights = torch.softmax(scores, dim=0)

print(weights)