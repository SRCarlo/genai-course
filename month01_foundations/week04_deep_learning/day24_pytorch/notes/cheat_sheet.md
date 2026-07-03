# Day 24 - PyTorch Cheat Sheet

## 1. PyTorch Overview

PyTorch is an open-source deep learning framework developed by Meta. It is used for building, training, and deploying neural networks with GPU acceleration and dynamic computation graphs.

---

## 2. Tensor

### Definition
A tensor is the core data structure in PyTorch, similar to NumPy arrays but optimized for GPUs.

### Creation
torch.tensor([1,2,3])
torch.zeros(2,2)
torch.ones(2,2)
torch.rand(2,2)
torch.randn(2,2)

### Properties
x.shape
x.dtype
x.device
x.ndim
x.numel()

---

## 3. Tensor Operations

### Arithmetic
x + y
x - y
x * y
x / y

### Matrix Multiplication
torch.matmul(a, b)

### Aggregations
x.mean()
x.sum()
x.max()
x.min()

---

## 4. Indexing & Slicing

x[0]
x[1][0]
x[:, 1]

---

## 5. Reshaping

x.view()
x.reshape()
x.flatten()
x.unsqueeze()
x.squeeze()

---

## 6. Device Management (CPU/GPU)

### Check device
torch.device("cuda" if torch.cuda.is_available() else "cpu")

### Move tensor/model
x = x.to(device)
model = model.to(device)

---

## 7. Autograd (Automatic Differentiation)

### Enable gradients
x.requires_grad = True

### Backpropagation
loss.backward()

### Gradients
x.grad

---

## 8. Neural Networks (nn.Module)

### Basic Structure
import torch.nn as nn

class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(2, 1)

    def forward(self, x):
        return self.linear(x)

---

## 9. Activation Functions

- ReLU → Hidden layers
- Sigmoid → Binary classification
- Softmax → Multi-class classification
- Tanh → Older architectures

---

## 10. Loss Functions

- MSELoss → Regression
- CrossEntropyLoss → Multi-class classification
- BCELoss → Binary classification

---

## 11. Optimizers

- SGD → Basic gradient descent
- Adam → Most commonly used
- AdamW → Modern deep learning models

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

---

## 12. Dataset & DataLoader

### Dataset
Defines how data is accessed.

### DataLoader
- Batch processing
- Shuffling
- Memory efficiency

from torch.utils.data import Dataset, DataLoader

---

## 13. Training Loop

for epoch in range(epochs):
    optimizer.zero_grad()
    outputs = model(inputs)
    loss = loss_fn(outputs, labels)
    loss.backward()
    optimizer.step()

---

## 14. Model Saving & Loading

### Save model
torch.save(model.state_dict(), "model.pth")

### Load model
model.load_state_dict(torch.load("model.pth"))
model.eval()

---

## 15. Prediction Workflow

with torch.no_grad():
    output = model(input)

---

## 16. Full PyTorch Pipeline

Data → Tensor → Dataset → DataLoader → Model → Loss → Backpropagation → Optimizer → Save → Predict

---

## 17. Key Interview Points

- PyTorch uses dynamic computation graphs
- Tensor is the main data structure
- Autograd handles automatic differentiation
- nn.Module is used for building models
- DataLoader handles batching and shuffling
- GPU acceleration improves performance
- Adam optimizer is widely used in deep learning