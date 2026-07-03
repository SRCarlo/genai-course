import torch.nn as nn

class StudentNN(nn.Module):

    def __init__(self):

        super().__init__()

        self.network = nn.Sequential(

            nn.Linear(2,8),

            nn.ReLU(),

            nn.Linear(8,1)

        )

    def forward(self,x):

        return self.network(x)

model = StudentNN()

print(model)