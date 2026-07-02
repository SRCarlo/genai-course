# Day 23 Notes — Backpropagation & Training Neural Networks

## Objective

Learn how neural networks improve their predictions using:

- Forward Propagation
- Loss Function
- Gradient
- Backpropagation
- Optimizers (SGD & Adam)
- Training Loop
- Epochs
- Batches
- Learning Rate
- Model Saving & Loading
- Prediction

---

# Learning Cycle of a Neural Network

```
Input Data
     │
     ▼
Forward Propagation
     │
     ▼
Prediction
     │
     ▼
Calculate Loss
     │
     ▼
Backpropagation
     │
     ▼
Update Weights
     │
     ▼
Repeat
     │
     ▼
Better Predictions
```

---

# Mental Model

Imagine a student taking an exam.

```
Actual Marks = 90
Predicted Marks = 65

Error = 25
```

The teacher points out the mistakes.

The student studies again.

```
Prediction = 82

Error = 8
```

The student studies again.

```
Prediction = 90

Error = 0
```

This is exactly how a neural network learns.

---

# Forward Propagation

Forward propagation is the process of sending input through the neural network to generate a prediction.

```
Input
   │
Weights
   │
Bias
   │
Activation Function
   │
Prediction
```

Forward propagation only makes predictions.

It does **not** learn.

---

# Loss Function

A Loss Function measures how wrong the prediction is.

```
Prediction = 80
Actual = 100

Loss = 20
```

Lower loss means a better model.

---

## Common Loss Functions

| Problem | Loss Function |
|----------|---------------|
| Regression | MSELoss |
| Binary Classification | BCELoss |
| Multi-Class Classification | CrossEntropyLoss |

---

# MSE (Mean Squared Error)

Formula

```
Loss = Average((Prediction − Actual)²)
```

Example

```
Prediction = 75
Actual = 90

Difference = 15

Loss = 15² = 225
```

Properties

- Penalizes large errors more heavily
- Smooth and differentiable
- Mostly used for regression problems

---

# Gradient

A Gradient tells us how each weight should change to reduce the loss.

Think of it as a GPS pointing toward the lowest error.

```
Current Weight
      │
Gradient
      │
Move Weight
      │
Lower Loss
```

---

# Backpropagation

Backpropagation computes gradients by sending the error backward through the network.

```
Prediction
     │
Loss
     │
Backpropagation
     │
Hidden Layers
     │
Input Layer
     │
Compute Gradients
```

Backpropagation itself **does not update weights**.

It only computes gradients.

---

# Optimizer

An Optimizer updates the weights using the gradients computed during backpropagation.

```
Old Weight
     │
Gradient
     │
Optimizer
     │
New Weight
```

Without an optimizer, the model cannot learn.

---

# SGD (Stochastic Gradient Descent)

SGD updates weights using the gradient.

Formula

```
New Weight = Old Weight − Learning Rate × Gradient
```

Advantages

- Simple
- Easy to understand
- Uses less memory

Disadvantages

- Can converge slowly
- May oscillate

---

# Adam Optimizer

Adam combines momentum with adaptive learning rates.

Advantages

- Faster convergence
- Stable training
- Works well in most deep learning tasks
- Industry standard optimizer

Common Learning Rate

```
0.001
```

Used by

- OpenAI
- Google
- Meta
- Microsoft

---

# Learning Rate

The Learning Rate controls how much the weights change during each update.

```
Large LR (0.1)

Big Steps
Fast
May overshoot

----------------------

Small LR (0.0001)

Tiny Steps
Slow
More stable
```

Common values

```
0.1
0.01
0.001
0.0001
```

Industry default

```
0.001
```

---

# Epoch

An Epoch is one complete pass through the entire training dataset.

Example

```
100 Images

↓

Model sees all 100 images once

↓

1 Epoch
```

Training usually requires many epochs.

---

# Batch

A Batch is a subset of the training dataset processed together.

Example

```
1000 Images

↓

100

↓

100

↓

100

↓

10 batches
```

Benefits

- Faster training
- Less memory usage
- Better GPU utilization

---

# Training Loop

Every epoch follows the same sequence.

```
Start Epoch

↓

Forward Pass

↓

Prediction

↓

Calculate Loss

↓

Backpropagation

↓

Optimizer Step

↓

Repeat
```

Typical PyTorch training loop

```python
optimizer.zero_grad()

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

optimizer.step()
```

---

# Why optimizer.zero_grad()?

PyTorch accumulates gradients by default.

Without clearing gradients,

```
Old Gradient

+

New Gradient

=

Incorrect Update
```

Always call

```python
optimizer.zero_grad()
```

before

```python
loss.backward()
```

---

# Why loss.backward()?

```
loss.backward()
```

computes gradients for every trainable parameter using automatic differentiation.

It prepares the gradients that the optimizer will use.

---

# Why optimizer.step()?

```
optimizer.step()
```

updates all trainable parameters using the computed gradients.

This is the actual learning step.

---

# Model Saving

Save only the model parameters.

```python
torch.save(
    model.state_dict(),
    "models/student_model.pth"
)
```

Benefits

- Reuse trained model
- Deploy later
- Continue training

---

# Model Loading

```python
model.load_state_dict(
    torch.load("models/student_model.pth")
)

model.eval()
```

Always call

```python
model.eval()
```

before inference.

---

# Prediction

```python
sample = torch.tensor([[8.0, 92.0]])

prediction = model(sample)

print(prediction)
```

Prediction is the final output after training.

---

# Complete Deep Learning Pipeline

```
Dataset
   │
Forward Pass
   │
Prediction
   │
Loss Function
   │
Backpropagation
   │
Optimizer
   │
Weight Update
   │
Repeat for Many Epochs
   │
Save Model
   │
Load Model
   │
Predict
```

---

# Training vs Prediction

| Training | Prediction |
|-----------|------------|
| Uses Forward Pass | Uses Forward Pass |
| Calculates Loss | No Loss |
| Uses Backpropagation | No Backpropagation |
| Updates Weights | No Weight Updates |
| Requires Optimizer | No Optimizer |

---

# Common Hyperparameters

- Learning Rate
- Batch Size
- Number of Epochs
- Hidden Layers
- Number of Neurons
- Optimizer
- Activation Function

---

# Industry Training Pipeline

```
Collect Data

↓

Clean Data

↓

Split Train/Test

↓

Build Model

↓

Forward Pass

↓

Loss

↓

Backpropagation

↓

Optimizer

↓

Repeat

↓

Evaluate

↓

Save Model

↓

Deploy
```

---

# Connection to ChatGPT

GPT training follows the same process.

```
Internet Data

↓

Transformer

↓

Forward Pass

↓

Prediction

↓

Loss

↓

Backpropagation

↓

Adam Optimizer

↓

Billions of Updates

↓

Language Understanding
```

---

# Key Terms Summary

| Term | Meaning |
|------|---------|
| Forward Pass | Generates prediction |
| Loss | Measures prediction error |
| Gradient | Direction to reduce error |
| Backpropagation | Computes gradients |
| Optimizer | Updates weights |
| Learning Rate | Step size for updates |
| Epoch | One full dataset pass |
| Batch | Small subset of data |
| Model Saving | Stores learned parameters |
| Model Loading | Restores trained model |
| Prediction | Output from trained model |

---

# Best Practices

- Normalize input data
- Use Adam optimizer by default
- Choose the correct loss function
- Monitor training loss
- Save the best model
- Use `model.eval()` during inference
- Tune learning rate if training is unstable
- Train for multiple epochs

---

# Interview Questions and Answers

## 1. What is Backpropagation?

**Answer:**

Backpropagation is the algorithm that computes the gradient of the loss with respect to every trainable parameter in a neural network. These gradients are then used by the optimizer to update the weights and reduce prediction error.

---

## 2. What is a Loss Function?

**Answer:**

A Loss Function measures the difference between the model's prediction and the actual target value. The goal during training is to minimize this loss.

---

## 3. What is the difference between Loss and Cost?

**Answer:**

- **Loss:** Error for a single training example or batch.
- **Cost:** Average or total loss over the entire dataset.

---

## 4. Why do we call `loss.backward()`?

**Answer:**

`loss.backward()` computes gradients for all trainable parameters using automatic differentiation. These gradients are required for updating the model weights.

---

## 5. Why do we call `optimizer.zero_grad()`?

**Answer:**

PyTorch accumulates gradients by default. Calling `optimizer.zero_grad()` clears old gradients before computing new ones, preventing incorrect updates.

---

## 6. What does `optimizer.step()` do?

**Answer:**

`optimizer.step()` updates the model's parameters using the gradients computed during backpropagation.

---

## 7. What is a Gradient?

**Answer:**

A Gradient indicates how much and in which direction a parameter should change to reduce the loss.

---

## 8. What is an Optimizer?

**Answer:**

An Optimizer is an algorithm that updates model weights based on computed gradients to minimize the loss.

---

## 9. What is SGD?

**Answer:**

Stochastic Gradient Descent (SGD) is an optimizer that updates model parameters using the gradient and a fixed learning rate.

---

## 10. Why is Adam the most popular optimizer?

**Answer:**

Adam adapts the learning rate for each parameter, converges faster, is more stable, and performs well across many deep learning tasks.

---

## 11. What is a Learning Rate?

**Answer:**

The Learning Rate controls the size of the weight update during optimization. A large value speeds up learning but may overshoot the optimum, while a small value provides more stable but slower learning.

---

## 12. What is an Epoch?

**Answer:**

An Epoch is one complete pass through the entire training dataset.

---

## 13. What is a Batch?

**Answer:**

A Batch is a subset of the training data processed together in one forward and backward pass.

---

## 14. Why are batches used?

**Answer:**

Batches reduce memory usage, improve computational efficiency, and allow faster training, especially on GPUs.

---

## 15. What happens during one training iteration?

**Answer:**

1. Forward Pass
2. Compute Prediction
3. Calculate Loss
4. Backpropagation
5. Optimizer Step
6. Update Weights

---

## 16. What is the purpose of `model.eval()`?

**Answer:**

`model.eval()` switches the model to evaluation mode by disabling training-specific behaviors such as dropout and using stored statistics for batch normalization.

---

## 17. Why do we save a model?

**Answer:**

Saving a model allows us to reuse it later without retraining, deploy it to production, or continue training from the saved state.

---

## 18. How do you save a PyTorch model?

**Answer:**

```python
torch.save(model.state_dict(), "model.pth")
```

---

## 19. How do you load a saved PyTorch model?

**Answer:**

```python
model.load_state_dict(torch.load("model.pth"))
model.eval()
```

---

## 20. Why is Backpropagation essential?

**Answer:**

Without backpropagation, gradients cannot be computed. Without gradients, the optimizer cannot update weights, and the neural network cannot learn from its mistakes.

---

# Quick Revision

- Forward Pass → Generates Prediction
- Loss Function → Measures Error
- Gradient → Shows Direction to Reduce Error
- Backpropagation → Computes Gradients
- Optimizer → Updates Weights
- Learning Rate → Controls Update Size
- Epoch → One Full Dataset Pass
- Batch → Small Data Subset
- Save Model → Store Learned Parameters
- Load Model → Restore Trained Model
- Prediction → Final Output After Training

---

# One-Line Summary

**A neural network learns by making predictions, measuring the error with a loss function, computing gradients through backpropagation, updating weights using an optimizer, and repeating this process over many epochs until the loss is minimized.**