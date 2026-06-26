# Day 17 – Classification (Binary & Multi-Class)
---

# 1. Introduction

Classification is one of the most important supervised machine learning tasks. Unlike regression, which predicts numerical values, classification predicts categories or labels.

Examples:

* Pass / Fail
* Spam / Not Spam
* Fraud / Safe
* Customer Churn
* Disease / No Disease

---

# 2. What is Classification?

Classification is a supervised learning algorithm that predicts a categorical output based on input features.

### Input

```
Hours Studied = 8
```

### Output

```
Pass
```

Instead of predicting a number, classification predicts a label.

---

# 3. Regression vs Classification

| Regression                | Classification      |
| ------------------------- | ------------------- |
| Predicts numerical values | Predicts categories |
| Salary Prediction         | Pass / Fail         |
| House Price               | Spam / Not Spam     |
| Temperature               | Fraud Detection     |
| Continuous Output         | Discrete Output     |

---

# 4. Types of Classification

## Binary Classification

A binary classifier predicts one of two possible classes.

Examples:

* Pass / Fail
* Yes / No
* True / False
* Spam / Not Spam
* Fraud / Safe

Example:

```
Hours = 7

Prediction

PASS
```

---

## Multi-Class Classification

A multi-class classifier predicts one class among multiple categories.

Examples:

* Grade A
* Grade B
* Grade C
* Grade D

Example

```
Marks = 82

Prediction

Grade A
```

---

# 5. Machine Learning Workflow

```
Dataset
   │
   ▼
Load Dataset
   │
   ▼
Data Preprocessing
   │
   ▼
Feature Selection
   │
   ▼
Model Training
   │
   ▼
Prediction
   │
   ▼
Evaluation
```

---

# 6. Dataset Overview

Student Dataset

| Hours | Result |
| ----- | ------ |
| 1     | Fail   |
| 2     | Fail   |
| 3     | Fail   |
| 4     | Fail   |
| 5     | Pass   |
| 6     | Pass   |
| 7     | Pass   |
| 8     | Pass   |

Feature (X)

```
hours
```

Target (y)

```
result
```

---

# 7. Binary Classification

Binary classification contains only two classes.

Examples

```
0 → Fail

1 → Pass
```

Python Example

```python
if marks >= 40:
    print("Pass")
else:
    print("Fail")
```

---

# 8. Multi-Class Classification

Contains more than two output classes.

Python Example

```python
if marks >= 80:
    print("Grade A")
elif marks >= 60:
    print("Grade B")
elif marks >= 40:
    print("Grade C")
else:
    print("Grade D")
```

---

# 9. Logistic Regression

Logistic Regression is one of the most widely used algorithms for classification problems.

Common Applications

* Spam Detection
* Fraud Detection
* Loan Approval
* Disease Prediction
* Customer Churn
* Email Filtering

Despite its name, Logistic Regression is a classification algorithm.

---

# 10. Training a Classification Model

```python
model = LogisticRegression()

model.fit(X, y)
```

`fit()` trains the model using historical data.

---

# 11. Making Predictions

```python
prediction = model.predict([[7]])
```

Output

```
[1]
```

Meaning

```
PASS
```

---

# 12. Model Evaluation

After training a model, its performance should be evaluated.

Common Evaluation Metrics

* Accuracy
* Precision
* Recall
* F1 Score
* Confusion Matrix

---

# 13. Accuracy

Accuracy represents the percentage of correct predictions.

Formula

```
Accuracy

Correct Predictions
-------------------
Total Predictions
```

Example

```
Correct Predictions = 8

Total Predictions = 10

Accuracy = 80%
```

Python

```python
accuracy_score(actual, predicted)
```

---

# 14. Confusion Matrix

A confusion matrix summarizes the performance of a classification model.

| Actual / Predicted | Positive | Negative |
| ------------------ | -------- | -------- |
| Positive           | TP       | FN       |
| Negative           | FP       | TN       |

## Terms

### TP (True Positive)

Actual = Positive

Predicted = Positive

Correct prediction.

---

### TN (True Negative)

Actual = Negative

Predicted = Negative

Correct prediction.

---

### FP (False Positive)

Actual = Negative

Predicted = Positive

Incorrect prediction.

Also called **Type-I Error**.

---

### FN (False Negative)

Actual = Positive

Predicted = Negative

Incorrect prediction.

Also called **Type-II Error**.

---

# 15. Industry Applications

Classification is used in almost every industry.

## Healthcare

* Disease Prediction
* Cancer Detection

## Banking

* Fraud Detection
* Loan Approval

## E-commerce

* Customer Churn Prediction
* Product Recommendation

## Email

* Spam Detection

## Social Media

* Sentiment Analysis

## Cybersecurity

* Malware Detection

---

# 16. Advantages

* Easy to understand
* Fast training
* Good baseline algorithm
* Produces probability scores
* Works well on small datasets

## Limitations

* Assumes linear decision boundary
* Sensitive to outliers
* Not suitable for highly complex relationships

---

# 17. Key Terms

| Term                | Meaning                       |
| ------------------- | ----------------------------- |
| Feature             | Input Variable                |
| Target              | Output Variable               |
| Classification      | Predict Categories            |
| Logistic Regression | Classification Algorithm      |
| Accuracy            | Correct Prediction Percentage |
| TP                  | True Positive                 |
| TN                  | True Negative                 |
| FP                  | False Positive                |
| FN                  | False Negative                |

---

# 18. Interview Questions & Answers

## 1. What is Classification?

Classification is a supervised learning technique used to predict categorical labels.

---

## 2. Difference between Regression and Classification?

Regression predicts numbers.

Classification predicts categories.

---

## 3. What is Binary Classification?

Classification with only two possible classes.

Example:

Pass / Fail

---

## 4. What is Multi-Class Classification?

Classification with more than two classes.

Example:

Grade A, B, C, D

---

## 5. What is Logistic Regression?

A supervised machine learning algorithm used for classification problems.

---

## 6. Is Logistic Regression a Regression Algorithm?

No.

It is a classification algorithm.

---

## 7. What is Supervised Learning?

Learning from labeled data.

---

## 8. What are Features?

Input variables used for prediction.

---

## 9. What is the Target Variable?

The output column the model predicts.

---

## 10. What is Accuracy?

The percentage of correct predictions.

---

## 11. What is a Confusion Matrix?

A table that evaluates classification performance using TP, TN, FP, and FN.

---

## 12. Explain TP.

True Positive means the model correctly predicted a positive class.

---

## 13. Explain TN.

True Negative means the model correctly predicted a negative class.

---

## 14. Explain FP.

False Positive means the model predicted positive when the actual class was negative.

---

## 15. Explain FN.

False Negative means the model predicted negative when the actual class was positive.

---

## 16. Name some Classification Algorithms.

* Logistic Regression
* Decision Tree
* Random Forest
* Support Vector Machine (SVM)
* K-Nearest Neighbors (KNN)
* Naive Bayes
* Neural Networks

---

## 17. Real-world Applications?

* Spam Detection
* Fraud Detection
* Medical Diagnosis
* Customer Churn
* Loan Approval
* Face Recognition
* Sentiment Analysis

---

# 19. Key Takeaways

* Classification predicts categories instead of numbers.
* Binary classification has two classes.
* Multi-class classification has more than two classes.
* Logistic Regression is a supervised learning algorithm.
* Accuracy measures prediction correctness.
* Confusion Matrix provides detailed evaluation.
* Features are inputs used for prediction.
* Target is the output label.
* Classification models learn from labeled datasets.
