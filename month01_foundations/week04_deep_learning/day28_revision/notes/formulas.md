# AI / ML / Deep Learning Formula Sheet

## Month 1 Mathematics Revision

Complete formula reference for Artificial Intelligence, Machine Learning, and Deep Learning.

---

# 1. Basic Mathematics


# Mean (Average)


Mean calculates the average value of data.


Formula:

```
Mean (μ) = Σx / n
```


Where:

- μ = Mean
- Σx = Sum of all values
- n = Number of values


Example:

Data:

```
10,20,30
```


Calculation:

```
Mean = (10+20+30)/3

Mean = 20
```


---

# Median


Median is the middle value after sorting data.


Example:


```
10,20,30,40,50
```


Median:

```
30
```


---

# Mode


Mode is the most frequently occurring value.


Example:


```
10,20,20,30
```


Mode:

```
20
```


---

# Range


Difference between maximum and minimum value.


Formula:

```
Range = Maximum - Minimum
```


Example:

```
100 - 20 = 80
```


---

# Variance


Variance measures how spread out data is.


Formula:


```
Variance = Σ(x - μ)² / n
```


Where:

- x = Data value
- μ = Mean
- n = Number of values


---

# Standard Deviation


Standard deviation is the square root of variance.


Formula:

```
σ = √Variance
```


---

# 2. Probability Formulas


# Basic Probability


Formula:


```
P(A)=
Favorable Outcomes /
Total Outcomes
```


Example:


Probability of rolling 6:


```
1/6
```


---

# Conditional Probability


Formula:


```
P(A|B)=P(A∩B)/P(B)
```


Meaning:

Probability of A given B.


---

# Bayes Theorem


Important for AI prediction.


Formula:


```
P(A|B)=
P(B|A)P(A) /
P(B)
```


Used in:

- Classification
- NLP
- Decision systems


---

# 3. Linear Algebra Formulas


# Vector


A vector contains numerical values.


Example:


```
X=[1,2,3]
```


---

# Vector Addition


Formula:


```
A+B=[a1+b1,a2+b2]
```


---

# Dot Product


Formula:


```
A.B =
a1b1+a2b2+...+anbn
```


Used in:

- Neural networks
- Attention


---

# Matrix Multiplication


For matrices:


```
(A×B)ij =
Σ Aik Bkj
```


Used heavily in:

- Neural networks
- Transformers


---

# Transpose


Changes rows into columns.


Notation:


```
Aᵀ
```


---

# 4. Calculus Formulas


# Derivative


Measures rate of change.


Notation:


```
dy/dx
```


---

# Gradient


Gradient is a vector containing derivatives.


Formula:


```
∇f(x)
```


Used in:

- Optimization
- Neural networks


---

# Chain Rule


Important for backpropagation.


Formula:


```
dy/dx =
dy/du × du/dx
```


---

# 5. Machine Learning Formulas


# Linear Regression


Equation:


```
y = mx + b
```


Where:

- m = slope
- b = bias
- x = input
- y = prediction


---

# Multiple Linear Regression


Formula:


```
y =
w1x1+w2x2+...+wnxn+b
```


Where:

- w = weights
- x = features
- b = bias


---

# Logistic Regression


Prediction:


```
y = σ(wx+b)
```


Sigmoid:


```
σ(x)=1/(1+e^-x)
```


Output:

```
0 to 1 probability
```


---

# 6. Loss Function Formulas


# Mean Squared Error (MSE)


Used for regression.


Formula:


```
MSE =
1/n Σ(y - ŷ)²
```


Where:

- y = actual value
- ŷ = predicted value


---

# Mean Absolute Error (MAE)


Formula:


```
MAE =
1/n Σ|y-ŷ|
```


---

# Binary Cross Entropy Loss


Used for binary classification.


Formula:


```
Loss =
-(y log(p)
+
(1-y)log(1-p))
```


Where:

- y = actual label
- p = prediction probability


---

# Cross Entropy Loss


Used for multi-class classification.


Formula:


```
Loss =
-Σ y log(p)
```


---

# 7. Gradient Descent Formulas


# Weight Update


Formula:


```
New Weight =
Old Weight -
Learning Rate × Gradient
```


Mathematically:


```
θ = θ - α∇J(θ)
```


Where:

- θ = Parameters
- α = Learning rate
- ∇J = Gradient


---

# Learning Rate


Controls step size during optimization.


Small learning rate:

- Slow training


Large learning rate:

- Unstable training


---

# 8. Neural Network Formulas


# Neuron Calculation


Formula:


```
z =
Wx+b
```


Where:

- W = Weight
- x = Input
- b = Bias


Output:


```
a = Activation(z)
```


---

# ReLU Activation


Formula:


```
ReLU(x)=max(0,x)
```


Example:


```
x=-5

Output=0
```


```
x=5

Output=5
```


---

# Sigmoid Activation


Formula:


```
σ(x)=1/(1+e^-x)
```


Range:


```
0 ≤ output ≤ 1
```


---

# Tanh Activation


Formula:


```
tanh(x)=
(e^x-e^-x)/
(e^x+e^-x)
```


Range:


```
-1 to 1
```


---

# Softmax Function


Used for multi-class classification.


Formula:


```
Softmax(xi)=
e^xi / Σe^xj
```


Output:

Probability distribution.


---

# 9. Backpropagation Formula


Gradient calculation:


```
∂Loss/∂Weight
```


Weight update:


```
Weight =
Weight -
Learning Rate × Gradient
```


---

# 10. Evaluation Metrics


# Accuracy


Formula:


```
Accuracy=
Correct Predictions /
Total Predictions
```


---

# Precision


Formula:


```
Precision=
TP/
(TP+FP)
```


Where:

- TP = True Positive
- FP = False Positive


---

# Recall


Formula:


```
Recall=
TP/
(TP+FN)
```


Where:

- FN = False Negative


---

# F1 Score


Formula:


```
F1=
2×Precision×Recall/
Precision+Recall
```


---

# Confusion Matrix


```
              Predicted

             P       N

Actual P    TP      FN

Actual N    FP      TN
```


---

# 11. Transformer Formulas


# Attention


Main Transformer formula:


```
Attention(Q,K,V)
=
softmax(QKᵀ/√dk)V
```


Where:


Q:

Query


K:

Key


V:

Value


dk:

Dimension of Key


---

# Embedding Similarity


Cosine similarity:


Formula:


```
Similarity=
A.B/
(||A|| ||B||)
```


Used in:

- Vector databases
- Semantic search


---

# 12. Token Related Concepts


# Tokens


Text is converted into tokens.


Example:


```
"I love AI"
```


Tokens:


```
[I, love, AI]
```


---

# Context Window


Maximum number of tokens a model can process.


---

# 13. Optimization Algorithms


# SGD


Stochastic Gradient Descent:


```
θ =
θ -
α∇J(θ)
```


---

# Adam Optimizer


Combines:

- Momentum
- Adaptive learning rate


Used commonly in:

- Deep learning
- Transformers


---

# 14. Important Deep Learning Concepts


## Epoch


One complete pass through training data.


---

## Batch


Small portion of training data.


---

## Iteration


One optimizer update step.


---

## Parameter


Values learned by model.


Examples:

- Weights
- Bias


---

## Hyperparameters


Values selected before training.


Examples:

- Learning rate
- Batch size
- Epochs


---

# Month 1 Formula Summary


## Machine Learning

```
Linear Regression

y=mx+b
```


## Probability

```
P(A)=Favorable/Total
```


## Gradient Descent

```
θ=θ-α∇J(θ)
```


## Neural Network

```
z=Wx+b
```


## Activation

```
ReLU=max(0,x)

Sigmoid=1/(1+e^-x)
```


## Attention

```
Attention(Q,K,V)
=
softmax(QKᵀ/√dk)V
```


---