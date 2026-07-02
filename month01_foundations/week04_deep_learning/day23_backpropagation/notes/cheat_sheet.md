# Day 23 Cheat Sheet — Backpropagation & Training Neural Networks

---

# Neural Network Learning Cycle

```
Input
   ↓
Forward Pass
   ↓
Prediction
   ↓
Loss Function
   ↓
Backpropagation
   ↓
Optimizer
   ↓
Update Weights
   ↓
Repeat
```

---

# Training Pipeline

```
Dataset
   ↓
Forward Pass
   ↓
Prediction
   ↓
Calculate Loss
   ↓
Backward Pass
   ↓
Update Weights
   ↓
Repeat (Epochs)
   ↓
Save Model
   ↓
Load Model
   ↓
Predict
```

---

# Forward Propagation

**Purpose:** Generate predictions from input data.

```
Input
   ↓
Weights
   ↓
Bias
   ↓
Activation Function
   ↓
Prediction
```

**PyTorch**

```python
prediction = model(x)
```

---

# Loss Function

**Purpose:** Measure prediction error.

```
Loss = Prediction Error
```

Lower loss = Better model

### Common Loss Functions

| Problem | Loss Function |
|----------|---------------|
| Regression | `nn.MSELoss()` |
| Binary Classification | `nn.BCELoss()` |
| Multi-Class Classification | `nn.CrossEntropyLoss()` |

Example

```python
loss_fn = nn.MSELoss()
loss = loss_fn(prediction, target)
```

---

# Gradient

Gradient tells the optimizer:

> Which direction should the weights move to reduce the loss?

---

# Backpropagation

Computes gradients for every trainable parameter.

```python
loss.backward()
```

---

# Optimizer

Updates model weights using gradients.

### SGD

```python
optimizer = optim.SGD(
    model.parameters(),
    lr=0.01
)
```

### Adam (Recommended)

```python
optimizer = optim.Adam(
    model.parameters(),
    lr=0.001
)
```

---

# Learning Rate

Controls the size of weight updates.

| Learning Rate | Effect |
|---------------|--------|
| 0.1 | Large steps |
| 0.01 | Medium steps |
| 0.001 | Industry default |
| 0.0001 | Very small steps |

---

# Epoch

One complete pass through the entire dataset.

```
1000 Samples

↓

Model sees all 1000 samples

↓

1 Epoch
```

---

# Batch

A subset of the training dataset processed together.

```
1000 Samples

↓

100

↓

100

↓

100

↓

10 Batches
```

---

# Standard PyTorch Training Loop

```python
for epoch in range(epochs):

    optimizer.zero_grad()

    prediction = model(x)

    loss = loss_fn(prediction, y)

    loss.backward()

    optimizer.step()
```

Training Steps

```
1. Forward Pass
2. Compute Loss
3. Zero Gradients
4. Backward Pass
5. Update Weights
```

---

# Why zero_grad()?

```python
optimizer.zero_grad()
```

Clears previously accumulated gradients before the next update.

---

# Why backward()?

```python
loss.backward()
```

Computes gradients using automatic differentiation.

---

# Why optimizer.step()?

```python
optimizer.step()
```

Updates the model parameters.

---

# Save Model

```python
torch.save(
    model.state_dict(),
    "models/student_model.pth"
)
```

---

# Load Model

```python
model.load_state_dict(
    torch.load("models/student_model.pth")
)

model.eval()
```

---

# Prediction

```python
sample = torch.tensor([[8.0, 92.0]])

prediction = model(sample)

print(prediction)
```

---

# Complete Example

```python
optimizer.zero_grad()

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

optimizer.step()
```

---

# Common Optimizers

| Optimizer | Usage |
|-----------|-------|
| SGD | Basic optimization |
| Adam | Industry standard |
| RMSProp | Older deep learning models |

---

# Common Loss Functions

| Loss Function | Used For |
|---------------|----------|
| MSELoss | Regression |
| BCELoss | Binary Classification |
| CrossEntropyLoss | Multi-Class Classification |

---

# Key Hyperparameters

| Hyperparameter | Typical Value |
|----------------|---------------|
| Learning Rate | 0.001 |
| Epochs | 50–500 |
| Batch Size | 16, 32, 64, 128 |
| Optimizer | Adam |
| Hidden Activation | ReLU |

---

# Training vs Prediction

| Training | Prediction |
|-----------|------------|
| Forward Pass | Forward Pass |
| Loss Calculation | No Loss |
| Backpropagation | No Backpropagation |
| Optimizer Step | No Optimizer |
| Updates Weights | Uses Learned Weights |

---

# Important PyTorch Functions

```python
model(x)
```

Forward pass

```python
loss_fn(prediction, target)
```

Compute loss

```python
loss.backward()
```

Compute gradients

```python
optimizer.zero_grad()
```

Clear gradients

```python
optimizer.step()
```

Update weights

```python
torch.save()
```

Save model

```python
torch.load()
```

Load model

```python
model.eval()
```

Evaluation mode

---

# Interview One-Liners

- **Forward Propagation:** Produces predictions from input data.
- **Loss Function:** Measures prediction error.
- **Gradient:** Indicates how weights should change.
- **Backpropagation:** Computes gradients for all trainable parameters.
- **Optimizer:** Updates weights using gradients.
- **Learning Rate:** Controls update step size.
- **Epoch:** One complete pass through the dataset.
- **Batch:** A subset of training data processed together.
- **Adam:** Adaptive optimizer with fast and stable convergence.
- **SGD:** Basic gradient-based optimization algorithm.

---

# Quick Revision Flow

```
Input
   ↓
Forward Pass
   ↓
Prediction
   ↓
Loss
   ↓
Backward Pass
   ↓
Optimizer
   ↓
Weight Update
   ↓
Repeat
```

---

# Day 23 Summary

- Forward Pass generates predictions.
- Loss measures prediction error.
- Backpropagation computes gradients.
- Optimizer updates model weights.
- Learning Rate controls update size.
- Epoch is one full pass over the dataset.
- Batch is a subset of training data.
- Adam is the most commonly used optimizer.
- Save trained models using `torch.save()`.
- Load models using `torch.load()` and `load_state_dict()`.
- Switch to evaluation mode with `model.eval()` before inference.

---

# Remember

> **Forward Pass → Loss → Backpropagation → Optimizer → Better Weights → Repeat → Trained Model**