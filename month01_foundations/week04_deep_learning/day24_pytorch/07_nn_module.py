import torch.nn as nn

class StudentModel(nn.Module):

    def __init__(self):

        super().__init__()

        self.linear = nn.Linear(2,1)

    def forward(self,x):

        return self.linear(x)

model = StudentModel()

print(model)