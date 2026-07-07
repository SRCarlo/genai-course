# AI / GenAI Month 1 Cheat Sheet

## Complete Quick Reference

---

# 1. Python Cheat Sheet

## Variables

Variables store data values.

```python
name = "AI Engineer"
age = 25
learning = True
```

---

# Data Types

| Data Type | Example |
|---|---|
| Integer | `10` |
| Float | `10.5` |
| String | `"AI"` |
| Boolean | `True` |
| List | `[1,2,3]` |
| Tuple | `(1,2,3)` |
| Dictionary | `{"name":"AI"}` |

---

# Input and Output

## Output

```python
print("Hello AI")
```

## Input

```python
name = input("Enter name: ")

print(name)
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
**
//
```

Example:

```python
a = 10
b = 5

print(a+b)
print(a-b)
print(a*b)
print(a/b)
```

---

## Comparison Operators

```python
==
!=
>
<
>=
<=
```

Example:

```python
age = 20

if age >= 18:
    print("Adult")
```

---

## Logical Operators

```python
and
or
not
```

Example:

```python
if age > 18 and age < 60:
    print("Working Age")
```

---

# Conditional Statements

```python
if condition:
    statement

elif condition:
    statement

else:
    statement
```

Example:

```python
marks = 80

if marks >= 50:
    print("Pass")

else:
    print("Fail")
```

---

# Loops

## For Loop

```python
for i in range(5):
    print(i)
```

---

## While Loop

```python
count = 0

while count < 5:

    print(count)

    count += 1
```

---

# Functions

Create reusable code.

```python
def add(a,b):

    return a+b
```

Usage:

```python
result = add(5,10)
```

---

# Lambda Function

Short anonymous function.

```python
square = lambda x:x*x

print(square(5))
```

---

# Lists

Create list:

```python
numbers = [1,2,3]
```

Add:

```python
numbers.append(4)
```

Remove:

```python
numbers.remove(2)
```

Length:

```python
len(numbers)
```

---

# Dictionary

```python
student = {

"name":"John",

"age":20

}
```

Access:

```python
student["name"]
```

---

# OOP Cheat Sheet


## Class

```python
class Student:

    def __init__(self,name):

        self.name=name
```

## Object

```python
s1 = Student("Alex")
```

---

# 2. NumPy Cheat Sheet

NumPy is used for numerical computing.

Import:

```python
import numpy as np
```

---

# Creating Arrays

```python
arr = np.array([1,2,3])
```

---

# Matrix

```python
matrix=np.array(
[
[1,2],
[3,4]
]
)
```

---

# Important NumPy Functions

Mean:

```python
np.mean(arr)
```

Sum:

```python
np.sum(arr)
```

Maximum:

```python
np.max(arr)
```

Minimum:

```python
np.min(arr)
```

Standard deviation:

```python
np.std(arr)
```

Shape:

```python
arr.shape
```

Reshape:

```python
arr.reshape()
```

---

# 3. Pandas Cheat Sheet

Pandas is used for data analysis.

Import:

```python
import pandas as pd
```

---

# Reading Data

CSV:

```python
df=pd.read_csv("data.csv")
```

Excel:

```python
df=pd.read_excel("data.xlsx")
```

---

# Viewing Data


First rows:

```python
df.head()
```


Last rows:

```python
df.tail()
```


Information:

```python
df.info()
```


Statistics:

```python
df.describe()
```

---

# Selecting Data


Column:

```python
df["column"]
```


Multiple columns:

```python
df[
["age","score"]
]
```

---

# Cleaning Data


Missing values:

```python
df.isnull()
```


Remove missing:

```python
df.dropna()
```


Fill missing:

```python
df.fillna(0)
```


Remove duplicates:

```python
df.drop_duplicates()
```

---

# 4. Machine Learning Cheat Sheet


# ML Workflow


```
Collect Data

↓

Clean Data

↓

Feature Engineering

↓

Split Dataset

↓

Train Model

↓

Evaluate Model

↓

Deploy
```

---

# Types of Machine Learning


## Supervised Learning

Uses labeled data.


Examples:

- Regression
- Classification


---

## Unsupervised Learning

No labels.


Examples:

- Clustering
- Dimensionality Reduction


---

# Algorithms


## Linear Regression

Purpose:

Predict continuous values.


Example:

```
House Price Prediction
```


---

## Logistic Regression

Purpose:

Binary classification.


Example:

```
Spam / Not Spam
```

---

## Decision Tree

Tree-based decision making.


---

## K-Means

Groups similar data points.


---

# Evaluation Metrics


## Accuracy

```
Correct Predictions / Total Predictions
```


## Precision

```
True Positive /
(True Positive + False Positive)
```


## Recall

```
True Positive /
(True Positive + False Negative)
```


## F1 Score

```
2 × Precision × Recall /
Precision + Recall
```

---

# 5. Deep Learning Cheat Sheet


# Neural Network


Structure:

```
Input Layer

↓

Hidden Layers

↓

Output Layer
```

---

# Neuron Formula


```
Output =
Activation(Weights × Input + Bias)
```

---

# Activation Functions


## ReLU

Formula:

```
max(0,x)
```


Used:

- Hidden layers


---

## Sigmoid

Formula:

```
1/(1+e^-x)
```


Output:

```
0 to 1
```

Used:

- Binary classification


---

# Loss Functions


## Mean Squared Error

Used for:

- Regression


## Cross Entropy Loss

Used for:

- Classification


---

# Optimizers


## SGD

Simple gradient optimizer.


## Adam

Adaptive optimizer.


Example:

```python
optimizer = torch.optim.Adam(
model.parameters()
)
```

---

# 6. PyTorch Cheat Sheet


Import:

```python
import torch

import torch.nn as nn
```

---

# Tensor


Create tensor:

```python
x=torch.tensor(
[1,2,3]
)
```

---

# Neural Network Class


```python
class Model(nn.Module):

    def __init__(self):

        super().__init__()
```

---

# Linear Layer


```python
nn.Linear(
input,
output
)
```

Example:

```python
nn.Linear(2,8)
```

---

# Activation


```python
nn.ReLU()
```

---

# Forward Pass


```python
def forward(self,x):

    return self.network(x)
```

---

# Training Process


```
Input

↓

Prediction

↓

Loss

↓

Backward

↓

Optimizer Update
```

---

# Backpropagation


```python
loss.backward()
```

---

# Update Weights


```python
optimizer.step()
```

---

# Save Model


```python
torch.save(
model.state_dict(),
"model.pth"
)
```

---

# Load Model


```python
model.load_state_dict(
torch.load("model.pth")
)
```

---

# 7. Transformer Cheat Sheet


# Transformer Flow


```
Input Text

↓

Tokenization

↓

Embedding

↓

Positional Encoding

↓

Attention

↓

Feed Forward

↓

Output
```

---

# Tokenization


Text converted into tokens.


Example:

```
"I love AI"

↓

["I","love","AI"]
```

---

# Embeddings


Tokens converted into vectors.


Example:

```
AI

↓

[0.25,0.67,0.89]
```

---

# Attention Formula


```
Attention(Q,K,V)

=
softmax(QKᵀ/√d)V
```

---

# GPT


- Decoder-only
- Text generation
- Autoregressive


---

# BERT


- Encoder-only
- Text understanding
- Bidirectional


---

# Git Cheat Sheet


Check status:

```bash
git status
```


Add files:

```bash
git add .
```


Commit:

```bash
git commit -m "message"
```


Push:

```bash
git push
```


Pull:

```bash
git pull
```

---

# Month 1 AI Flow


```
Python

↓

NumPy + Pandas

↓

Mathematics

↓

Machine Learning

↓

Deep Learning

↓

PyTorch

↓

Attention

↓

Transformers

↓

LLM Engineering
```

---
