from torch.utils.data import Dataset

class StudentDataset(Dataset):

    def __init__(self):

        self.data = [
            ([2,70],0),
            ([5,80],1),
            ([7,90],1)
        ]

    def __len__(self):

        return len(self.data)

    def __getitem__(self,index):

        return self.data[index]

dataset = StudentDataset()

print(len(dataset))

print(dataset[0])



from torch.utils.data import DataLoader

loader = DataLoader(
    dataset,
    batch_size=2,
    shuffle=True
)

for batch in loader:

    print(batch)