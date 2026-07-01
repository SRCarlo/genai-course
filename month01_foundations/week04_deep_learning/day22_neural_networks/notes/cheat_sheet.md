# Day 22 Cheat Sheet - Neural Networks

---

# Deep Learning

Uses neural networks with multiple layers to learn complex patterns.

---

# Neural Network Formula

Output = Activation((Inputs × Weights) + Bias)

or

Y = Activation(WX + B)

---

# Neural Network Structure

Input Layer

↓

Hidden Layer

↓

Output Layer

---

# Layers

| Layer | Purpose |
|--------|----------|
| Input | Receives Features |
| Hidden | Learns Patterns |
| Output | Final Prediction |

---

# Important Terms

Input

Raw data

Example:

- Hours Studied
- Attendance

Weights

Importance of each feature.

Bias

Additional learnable value.

Activation Function

Adds non-linearity.

Prediction

Final output.

---

# Activation Functions

## ReLU

Formula

ReLU(x) = max(0, x)

Range

0 → ∞

Use

Hidden Layers

---

## Sigmoid

Formula

1 / (1 + e^-x)

Range

0 → 1

Use

Binary Classification

---

## Tanh

Range

-1 → 1

Use

Older Neural Networks

---

## Softmax

Range

0 → 1

Use

Multi-Class Classification

---

# Forward Propagation

Input

↓

Weights

↓

Bias

↓

Activation

↓

Prediction

---

# Backpropagation

Prediction

↓

Loss

↓

Gradient Calculation

↓

Weight Update

↓

Better Prediction

---

# PyTorch Model

```python
model = nn.Sequential(
    nn.Linear(2,4),
    nn.ReLU(),
    nn.Linear(4,1)
)
```

---

# PyTorch Installation

```bash
pip install torch torchvision
```

Verify

```bash
pip show torch
```

---

# Common Layers

```python
nn.Linear()

nn.ReLU()

nn.Sigmoid()

nn.Softmax()

nn.Tanh()
```

---

# Sample Prediction

```python
sample = torch.tensor([[6.0, 90.0]])

prediction = model(sample)
```

---

# Machine Learning vs Deep Learning

| Machine Learning | Deep Learning |
|------------------|---------------|
| Manual Features | Automatic Features |
| Small Data | Large Data |
| Faster Training | Slower Training |
| Less Computation | High Computation |
| Structured Data | Images, Audio, Text |

---

# Applications

- ChatGPT
- Image Recognition
- NLP
- Medical Diagnosis
- Fraud Detection
- Recommendation Systems
- Speech Recognition
- Autonomous Vehicles

---

# Interview One-Liners

- Deep Learning is a subset of Machine Learning.
- Neural Networks are inspired by the human brain.
- Perceptron is the simplest neural network.
- Weights represent feature importance.
- Bias shifts the prediction.
- ReLU is the most commonly used activation function.
- Forward Propagation makes predictions.
- Backpropagation updates weights.
- PyTorch is a leading Deep Learning framework.
- Transformers are built using deep neural networks.
- Large Language Models (LLMs) are powered by Transformer architectures.

---

# Learning Flow

Artificial Intelligence

↓

Machine Learning

↓

Deep Learning

↓

Neural Networks

↓

CNN / RNN

↓

Transformers

↓

Large Language Models

↓

ChatGPT

---