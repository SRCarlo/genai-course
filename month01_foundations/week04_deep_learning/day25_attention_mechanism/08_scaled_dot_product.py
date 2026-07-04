import torch

Q = torch.tensor([[1.,2.]])
K = torch.tensor([[2.,3.]])
V = torch.tensor([[5.,6.]])

score = torch.matmul(Q, K.T)

print(score)

output = torch.matmul(score, V)

print(output)