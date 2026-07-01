# Day 22 - Neural Networks (Introduction to Deep Learning)

---

# What is Deep Learning?

Deep Learning is a subset of Machine Learning that uses multiple layers of artificial neurons to learn complex patterns from data.

Unlike traditional Machine Learning, Deep Learning automatically learns useful features without manual feature engineering.

Examples:

- Image Recognition
- Speech Recognition
- Language Translation
- ChatGPT
- Self Driving Cars

---

# Why Deep Learning?

Traditional Machine Learning performs well on structured data such as:

- Age
- Salary
- Marks
- Experience

However, it struggles with:

- Images
- Audio
- Videos
- Natural Language

Deep Learning is designed to solve these problems.

---

# What is a Neural Network?

A Neural Network is a computational model inspired by the human brain.

It consists of many connected artificial neurons that process information and learn patterns from data.

Flow:

Input

↓

Hidden Layer

↓

Output

↓

Prediction

---

# Biological vs Artificial Neuron

## Biological Neuron

Dendrites

↓

Cell Body

↓

Axon

↓

Signal

## Artificial Neuron

Inputs

↓

Weights

↓

Bias

↓

Activation Function

↓

Output

---

# Components of a Neural Network

## 1. Input Layer

Receives input features.

Example:

- Study Hours
- Attendance

---

## 2. Hidden Layer

Processes information and learns relationships between features.

Multiple hidden layers create Deep Neural Networks.

---

## 3. Output Layer

Produces the final prediction.

Examples:

- Pass / Fail
- House Price
- Digit Recognition

---

# Perceptron

A Perceptron is the simplest neural network.

Formula:

Output = Activation((Inputs × Weights) + Bias)

Example:

Inputs = [6, 90]

Weights = [0.8, 0.2]

Bias = 1

---

# Weights

Weights determine the importance of each feature.

Higher Weight

↓

Greater Influence

Example:

Study Hours → High Weight

Attendance → Medium Weight

Uniform Color → Near Zero Weight

Weights are automatically updated during training.

---

# Bias

Bias is an additional learnable parameter.

Purpose:

- Shifts prediction
- Improves flexibility
- Helps fit data better

Formula:

Z = WX + B

---

# Activation Functions

Activation functions introduce non-linearity into neural networks.

Without them, neural networks behave like linear regression.

---

## ReLU

Formula

ReLU(x) = max(0, x)

Example

Input = -5

Output = 0

Input = 12

Output = 12

Advantages

- Fast
- Simple
- Most commonly used

---

## Sigmoid

Formula

1 / (1 + e^-x)

Output Range

0 → 1

Uses

Binary Classification

Example

0.95

means

95% probability

---

## Tanh

Output Range

-1 → +1

Advantages

Zero-centered outputs.

Mostly used in older neural networks.

---

## Softmax

Converts outputs into probabilities.

Example

Cat = 0.80

Dog = 0.15

Bird = 0.05

Highest probability becomes the prediction.

Used in Multi-Class Classification.

---

# Forward Propagation

Forward Propagation is the process of generating predictions.

Flow:

Input

↓

Weights

↓

Bias

↓

Activation Function

↓

Prediction

No learning occurs during Forward Propagation.

---

# Backpropagation (Introduction)

After prediction:

Error is calculated.

↓

Weights are updated.

↓

Prediction improves.

This learning process is called Backpropagation.

---

# PyTorch

PyTorch is one of the most popular Deep Learning frameworks.

Advantages

- Easy to learn
- Dynamic computation graph
- GPU acceleration
- Strong community support
- Widely used in research and production

---

# Basic PyTorch Model

```python
model = nn.Sequential(
    nn.Linear(2,4),
    nn.ReLU(),
    nn.Linear(4,1)
)
```

---

# Neural Network Pipeline

Dataset

↓

Input Layer

↓

Hidden Layer

↓

Activation Function

↓

Output Layer

↓

Prediction

---

# Deep Learning Roadmap

Artificial Intelligence

↓

Machine Learning

↓

Deep Learning

↓

Neural Networks

↓

CNN

↓

RNN

↓

Transformers

↓

Large Language Models

↓

ChatGPT

---

# Real-World Applications

- ChatGPT
- Face Recognition
- Medical Imaging
- Fraud Detection
- Voice Assistants
- Recommendation Systems
- Autonomous Vehicles

---

# Companies Using Deep Learning

- OpenAI
- Google
- Microsoft
- Meta
- Amazon
- NVIDIA
- Tesla

---

# Interview Questions and Answers

## 1. What is Deep Learning?

Deep Learning is a subset of Machine Learning that uses neural networks with multiple layers to learn complex patterns from data.

---

## 2. What is a Neural Network?

A Neural Network is a mathematical model inspired by the human brain consisting of interconnected artificial neurons.

---

## 3. What is a Perceptron?

A Perceptron is the simplest artificial neuron that performs a weighted sum of inputs, adds a bias, and applies an activation function.

---

## 4. What are Weights?

Weights are learnable parameters that determine the importance of each input feature.

---

## 5. What is Bias?

Bias is an additional learnable parameter that shifts the output of a neuron.

---

## 6. Why are Activation Functions used?

Activation functions introduce non-linearity, allowing neural networks to learn complex relationships.

---

## 7. What is ReLU?

ReLU is an activation function defined as:

ReLU(x) = max(0, x)

It is the most commonly used activation function in hidden layers.

---

## 8. What is Sigmoid?

Sigmoid converts values into probabilities between 0 and 1.

Mostly used for binary classification.

---

## 9. What is Softmax?

Softmax converts multiple outputs into probability values whose total equals 1.

Used for multi-class classification.

---

## 10. What is Forward Propagation?

Forward Propagation is the process of passing input data through the neural network to generate predictions.

---

## 11. What is Backpropagation?

Backpropagation is the learning process where errors are propagated backward to update weights.

---

## 12. Why is PyTorch popular?

Because it provides:

- Dynamic computation graph
- GPU support
- Easy debugging
- Production readiness
- Excellent research support

---

## 13. Difference between Machine Learning and Deep Learning?

Machine Learning often requires manual feature engineering, while Deep Learning automatically learns features using neural networks.

---

## 14. How are Neural Networks related to ChatGPT?

ChatGPT is built using very large neural networks based on the Transformer architecture.

---

# Key Takeaways

✔ Deep Learning is a subset of Machine Learning.

✔ Neural Networks are inspired by the human brain.

✔ Perceptrons are the basic building blocks.

✔ Weights and Bias are learnable parameters.

✔ Activation Functions introduce non-linearity.

✔ ReLU is the most widely used activation function.

✔ Forward Propagation generates predictions.

✔ PyTorch is a leading framework for Deep Learning.

✔ Neural Networks are the foundation of Large Language Models like ChatGPT.