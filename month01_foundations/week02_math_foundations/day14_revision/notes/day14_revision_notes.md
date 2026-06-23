# Day 14 - Week 2 Revision Notes

## Goal of Day 14

Day 14 is a complete revision day.

---

# Week 2 Learning Journey

## Day 8 - Linear Algebra

Linear Algebra is the mathematics of vectors and matrices.

AI models cannot understand text directly.

They convert information into numerical representations called vectors.

Example:

```python
vector = [10, 20, 30]
print(vector)
```

Output:

```python
[10, 20, 30]
```

### Important Concepts

#### Vector

A collection of numbers arranged in a single dimension.

Example:

```python
[1, 2, 3]
```

#### Matrix

A collection of vectors arranged in rows and columns.

Example:

```python
[
 [1, 2],
 [3, 4]
]
```

#### Dimensions

Number of values inside a vector.

Example:

```python
[10, 20, 30]
```

Dimension = 3

#### Dot Product

Used to measure similarity between vectors.

Formula:

```text
A · B = Σ(Ai × Bi)
```

### AI Applications

* Text Embeddings
* Recommendation Systems
* Computer Vision
* Neural Networks

### Key Takeaway

Linear Algebra is the foundation for representing data in AI.

---

# Day 9 - Probability

Probability measures uncertainty.

It helps AI estimate the likelihood of future events.

Formula:

```text
Probability =
Favorable Outcomes
-------------------
Total Outcomes
```

Example:

Rolling a dice

```text
P(6) = 1/6
```

### AI Example

Input:

```text
I love _____
```

Prediction:

```text
Python = 70%
Java = 20%
C++ = 10%
```

The model selects the highest probability.

### Applications

* Language Models
* Spam Detection
* Risk Analysis
* Recommendation Systems

### Key Takeaway

Probability helps AI make intelligent predictions under uncertainty.

---

# Day 10 - Statistics

Statistics helps us understand data.

Before training a model, we analyze data using statistical techniques.

## Mean

Average value.

Formula:

```text
Mean = Sum of Values / Total Values
```

Example:

```python
numbers = [10,20,30,40,50]
mean = sum(numbers)/len(numbers)
```

Output:

```python
30
```

## Median

Middle value after sorting data.

Example:

```text
10 20 30 40 50
```

Median = 30

## Mode

Most frequently occurring value.

Example:

```text
2 2 3 4 5
```

Mode = 2

## Variance

Measures spread of data.

Higher variance means data is more scattered.

## Standard Deviation

Square root of variance.

Measures consistency.

## Outlier

A value significantly different from other values.

Example:

```text
10 12 11 13 150
```

150 is an outlier.

### Applications

* Data Cleaning
* Feature Engineering
* Data Analysis
* Model Evaluation

### Key Takeaway

Statistics helps transform raw data into useful information.

---

# Day 11 - Calculus

Calculus studies change.

Machine Learning uses calculus to understand how errors change.

## Function

A mathematical relationship between inputs and outputs.

Example:

```python
f(x) = x²
```

## Slope

Measures steepness.

## Derivative

Measures how rapidly a function changes.

Example:

```text
f(x) = x²

Derivative = 2x
```

## Gradient

Collection of derivatives.

Shows the direction of maximum increase.

### AI Use

Model Prediction

↓

Error Calculation

↓

Derivative Calculation

↓

Parameter Update

↓

Better Prediction

### Key Takeaway

Calculus helps AI learn from mistakes.

---

# Day 12 - Gradient Descent

Gradient Descent is an optimization algorithm.

Its objective is to minimize model error.

## Formula

```text
New Weight

=

Old Weight
-
Learning Rate × Gradient
```

Example:

```python
weight = 10
gradient = 2
lr = 0.1

weight = weight - lr * gradient

print(weight)
```

Output:

```python
9.8
```

### Components

#### Weight

Model parameter.

#### Gradient

Direction of error increase.

#### Learning Rate

Controls step size.

### AI Workflow

Prediction

↓

Loss

↓

Gradient

↓

Weight Update

↓

Better Prediction

### Key Takeaway

Gradient Descent is the engine that trains Machine Learning models.

---

# Day 13 - Machine Learning Mini Project

Machine Learning enables systems to learn patterns from data.

## Workflow

Collect Data

↓

Clean Data

↓

Train Model

↓

Predict

↓

Evaluate

### Important Terms

#### Dataset

Collection of training data.

#### Feature

Input variable.

Example:

```text
Hours Studied
```

#### Target

Output variable.

Example:

```text
Exam Score
```

#### Prediction

Model output.

#### Error

Difference between actual and predicted value.

#### Training

Process of learning patterns from data.

### Key Takeaway

Machine Learning converts data into predictions.

---

# Complete AI Pipeline

Data

↓

Statistics

↓

Probability

↓

Linear Algebra

↓

Calculus

↓

Gradient Descent

↓

Machine Learning

↓

Deep Learning

↓

Transformers

↓

Large Language Models (LLMs)

---

# Final Summary

Linear Algebra represents data.

Probability handles uncertainty.

Statistics analyzes data.

Calculus measures change.

Gradient Descent optimizes learning.

Machine Learning finds patterns.

Together these concepts form the mathematical foundation of Artificial Intelligence.
