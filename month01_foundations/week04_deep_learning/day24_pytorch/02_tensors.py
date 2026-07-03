import torch

scalar = torch.tensor(5)

vector = torch.tensor([1,2,3])

matrix = torch.tensor([
    [1,2],
    [3,4]
])

tensor3d = torch.tensor([
    [
        [1,2],
        [3,4]
    ]
])

print("Scalar:", scalar)
print("Vector:", vector)
print("Matrix:", matrix)
print("3D Tensor:", tensor3d)

print(vector.shape)
print(matrix.shape)
print(tensor3d.shape)