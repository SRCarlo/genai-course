# Month 1 Complete Summary - AI / GenAI Foundations

## Overview

Month 1 focused on building the foundation required for Artificial Intelligence, Machine Learning, Deep Learning, and future LLM Engineering.

The journey covered:

Python
↓
Data Science
↓
Mathematics
↓
Machine Learning
↓
Deep Learning
↓
Transformers
↓
Generative AI Foundations


---

# Week 1: Python Programming Fundamentals

## 1. Python Installation

Python is a high-level programming language widely used in AI, Data Science, and automation.

Important concepts:

- Python interpreter
- Virtual environments
- Packages
- pip package manager


Example:

```python
print("Hello AI")
```


---

# Variables

Variables store values in memory.

Example:

```python
name = "AI Engineer"

age = 25

learning = True
```


Types:

- Integer
- Float
- String
- Boolean
- List
- Tuple
- Dictionary


---

# Data Types


## Integer

```python
x = 10
```


## Float

```python
price = 99.5
```


## String

```python
name = "Python"
```


## Boolean

```python
is_ai = True
```


---

# Operators


## Arithmetic Operators

```python
+
-
*
/
%
```


Example:

```python
a = 10
b = 5

print(a+b)
```


---

# Conditional Statements


Used for decision making.


Example:

```python
score = 90

if score >= 50:
    print("Pass")

else:
    print("Fail")
```


---

# Loops


Loops repeat instructions.


## For Loop

```python
for i in range(5):
    print(i)
```


## While Loop

```python
count = 0

while count < 5:
    print(count)
    count += 1
```


---

# Functions


Functions are reusable blocks of code.


Example:

```python
def add(a,b):
    return a+b
```


Benefits:

- Code reuse
- Better organization
- Easy debugging


---

# Object Oriented Programming


OOP organizes programs using classes and objects.


Concepts:

- Class
- Object
- Inheritance
- Encapsulation
- Polymorphism


Example:

```python
class Student:

    def __init__(self,name):
        self.name=name
```


---

# Week 2: Data Science Foundations


## NumPy


NumPy is used for numerical computing.


Features:

- Arrays
- Mathematical operations
- Matrix operations


Example:

```python
import numpy as np

arr=np.array([1,2,3])

print(arr)
```


Important functions:

```python
np.mean()

np.sum()

np.max()

np.min()
```


---

# Pandas


Pandas is used for data manipulation and analysis.


Creating DataFrame:

```python
import pandas as pd

df=pd.read_csv("data.csv")
```


Important functions:


## View Data

```python
df.head()
```


## Information

```python
df.info()
```


## Statistics

```python
df.describe()
```


---

# Data Cleaning


Real-world data contains:

- Missing values
- Duplicate records
- Wrong formats


Common operations:


Remove missing values:

```python
df.dropna()
```


Fill missing values:

```python
df.fillna()
```


Remove duplicates:

```python
df.drop_duplicates()
```


---

# Week 3: Mathematics for AI


# Linear Algebra


Important concepts:


## Vector

A list of numbers representing data.


Example:

```
[1,2,3]
```


## Matrix

A collection of vectors.


Example:

```
[
1 2
3 4
]
```


Used in:

- Neural networks
- Embeddings
- Transformations


---

# Probability


Probability measures uncertainty.


Formula:

```
Probability = Favorable Outcomes / Total Outcomes
```


Used in:

- Classification
- Prediction
- Language Models


---

# Statistics


Important concepts:


## Mean

Average value.


## Median

Middle value.


## Mode

Most frequent value.


## Variance

Measures data spread.


## Standard Deviation

Measures deviation from mean.


---

# Calculus


Used for optimization.


Important concept:

Gradient


Gradient shows the direction of maximum change.


Used in:

- Neural network training
- Backpropagation


---

# Gradient Descent


Optimization algorithm used to reduce errors.


Formula:


```
New Weight =
Old Weight -
Learning Rate × Gradient
```


Process:

1. Prediction
2. Calculate Loss
3. Calculate Gradient
4. Update Weights


---

# Week 3 Machine Learning


## Machine Learning


Machine Learning enables computers to learn patterns from data.


Types:


## Supervised Learning


Uses labeled data.


Examples:

- Regression
- Classification


---

## Regression


Predicts continuous values.


Example:

House price prediction


Algorithms:

- Linear Regression


---

## Classification


Predicts categories.


Example:

Spam detection


Algorithms:

- Logistic Regression
- Decision Tree


---

## Clustering


Finds hidden patterns without labels.


Example:

Customer segmentation


Algorithm:

- K-Means


---

# Evaluation Metrics


## Accuracy


Correct predictions / Total predictions


## Precision


Correct positive predictions


## Recall


Finding all positive cases


## F1 Score


Balance between precision and recall


---

# Week 4 Deep Learning


# Neural Networks


A neural network contains:

- Input layer
- Hidden layers
- Output layer


Each neuron contains:

- Weights
- Bias
- Activation function


---

# Activation Functions


## ReLU


Most common hidden layer activation.


Formula:

```
max(0,x)
```


## Sigmoid


Outputs probability between 0 and 1.


Used for binary classification.


---

# Loss Function


Measures prediction error.


Examples:

- MSE
- Cross Entropy


---

# Backpropagation


Backpropagation updates neural network weights.


Steps:


1. Forward pass
2. Calculate loss
3. Calculate gradients
4. Update weights


---

# PyTorch


PyTorch is a deep learning framework.


Important components:


## Tensor


Multi-dimensional array.


```python
torch.tensor()
```


---

## Neural Network Module


```python
nn.Module
```


---

## Layers


```python
nn.Linear()
```


---

## Optimizers


```python
optim.Adam()
```


---

# Attention Mechanism


Attention allows models to focus on important information.


Used in:

- Transformers
- LLMs


---

# Transformers


Transformer architecture introduced the attention-based approach.


Components:


Input

↓

Embedding

↓

Positional Encoding

↓

Self Attention

↓

Feed Forward Network

↓

Output


---

# Generative AI


Generative AI creates new content.


Examples:

- Text
- Images
- Code


---

# Large Language Models


LLMs are deep learning models trained on massive text datasets.


Examples:

- GPT
- BERT
- LLaMA


---

# Month 1 Capstone


## Student Performance Predictor


Objective:

Predict student pass/fail using:


Input:

- Study Hours
- Attendance


Model:

Neural Network using PyTorch


Skills Applied:

- Python
- Pandas
- Data Processing
- Neural Networks
- Model Training
- Model Saving
- Prediction


---

# Month 1 Outcome


After completing Month 1:

You understand:

-  Python Programming

-  Data Analysis

-  Mathematics for AI

-  Machine Learning

-  Deep Learning

-  PyTorch

-  Transformers Basics

-  AI Project Development


Ready for:

Month 2 - NLP and LLM Engineering Foundations