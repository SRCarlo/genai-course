# Day 24 - PyTorch Fundamentals

## Overview

PyTorch is an open-source deep learning framework developed by Meta. It is widely used for building neural networks, computer vision models, natural language processing systems, and large language models.

PyTorch uses dynamic computation graphs, which makes it flexible and easy to debug compared to static graph frameworks.

---

## Core Concepts

### 1. Tensor

A tensor is the main data structure in PyTorch. It is a multi-dimensional array similar to NumPy arrays but supports GPU acceleration.

Types of tensors:
- Scalar (0D)
- Vector (1D)
- Matrix (2D)
- Higher-dimensional tensors (3D and above)

Tensors are the foundation of all deep learning computations.

---

### 2. Tensor Operations

PyTorch supports:
- Addition, subtraction, multiplication, division
- Matrix multiplication
- Aggregations (mean, sum, max, min)

These operations are used inside neural networks.

---

### 3. Tensor Indexing

Tensors support indexing and slicing similar to NumPy:
- Access rows and columns
- Extract subsets
- Feature selection

---

### 4. CPU vs GPU

CPU is general-purpose but slower for deep learning.

GPU is optimized for parallel computation and is much faster.

Device selection:

torch.device("cuda" if torch.cuda.is_available() else "cpu")

---

### 5. Autograd

Autograd is PyTorch’s automatic differentiation engine.

It:
- Tracks tensor operations
- Builds computation graph
- Computes gradients automatically

Backward propagation:

loss.backward()

---

### 6. nn.Module

nn.Module is the base class for all neural networks in PyTorch.

It is used to:
- Define layers
- Define forward pass
- Manage parameters

---

### 7. Dataset and DataLoader

Dataset defines how data is accessed.

DataLoader:
- Loads data in batches
- Shuffles data
- Improves efficiency

---

### 8. Training Pipeline

Steps:
1. Load dataset
2. Create DataLoader
3. Define model
4. Define loss function
5. Define optimizer
6. Forward pass
7. Compute loss
8. Backpropagation
9. Update weights

---

### 9. Model Saving and Loading

Save model:

torch.save(model.state_dict(), "model.pth")

Load model:

model.load_state_dict(torch.load("model.pth"))

---

### 10. Prediction Process

Steps:
- Load model
- model.eval()
- torch.no_grad()
- Run inference

---

## Interview Questions and Answers

### 1. What is PyTorch?

PyTorch is an open-source deep learning framework used for building and training neural networks with GPU acceleration.

---

### 2. What is a tensor?

A tensor is a multi-dimensional array used as the core data structure in PyTorch.

---

### 3. Difference between NumPy and PyTorch tensors?

NumPy runs on CPU only, while PyTorch supports GPU acceleration and automatic differentiation.

---

### 4. What is Autograd?

Autograd automatically computes gradients for backpropagation.

---

### 5. What is requires_grad?

It enables gradient tracking for tensors.

---

### 6. What is nn.Module?

It is the base class for defining neural networks in PyTorch.

---

### 7. What is DataLoader?

DataLoader loads data in batches and improves training efficiency.

---

### 8. Why use batching?

It reduces memory usage and stabilizes training.

---

### 9. Difference between train() and eval()?

train() enables training behavior, eval() disables it for inference.

---

### 10. Why use torch.no_grad()?

It disables gradient tracking during inference to improve performance.

---

### 11. What is state_dict?

It is a dictionary containing model parameters.

---

### 12. Why is PyTorch widely used?

Because it is flexible, easy to use, supports GPU acceleration, and is widely adopted in research and industry.

---

### 13. What happens in backward()?

It computes gradients for all model parameters.

---

### 14. Why is Adam optimizer used?

Because it adapts learning rates and converges faster than SGD.