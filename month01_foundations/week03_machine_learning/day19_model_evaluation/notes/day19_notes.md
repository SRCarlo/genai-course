# Day 19 - Model Evaluation Metrics

## Objective

Machine Learning models are not useful unless we know how well they perform.

Model Evaluation Metrics help us measure the quality of predictions.

Without evaluation metrics, we cannot compare models or determine whether a model is good enough for production.

---

# Machine Learning Workflow

Dataset

   ↓

Train Model

   ↓

Predict Output

   ↓

Evaluate Predictions

   ↓

Improve Model

---

# Why Model Evaluation is Important

Evaluation metrics answer questions like:

- Is the model accurate?
- Is the model making too many mistakes?
- Which model is better?
- Can this model be used in production?

Example:

A customer churn model predicts whether customers will leave.

If the model predicts incorrectly, the company may lose valuable customers.

Therefore, evaluation metrics are essential.

---

# Types of Evaluation Metrics

There are mainly two types.

## 1. Classification Metrics

Used when output is categories.

Examples:

- Spam Detection
- Fraud Detection
- Disease Prediction
- Sentiment Analysis

Metrics:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

---

## 2. Regression Metrics

Used when output is numerical.

Examples:

- House Price Prediction
- Temperature Prediction
- Sales Forecasting

Metrics:

- MAE
- MSE
- RMSE
- R² Score

---

# 1. Accuracy

Definition

Accuracy measures how many predictions are correct.

Formula

Accuracy = Correct Predictions / Total Predictions

Example

10 predictions

9 correct

Accuracy = 90%

Python

```python
from sklearn.metrics import accuracy_score

accuracy_score(actual,predicted)
```

Advantages

- Easy to understand
- Works well for balanced datasets

Disadvantages

- Poor metric for imbalanced datasets

Industry Use

General classification problems

---

# 2. Precision

Definition

Out of all positive predictions,

how many were actually positive?

Formula

Precision = TP / (TP + FP)

Question

"When the model predicts YES,
how often is it correct?"

High Precision Means

- Few False Positives

Example

Spam Detection

If Gmail labels an email as spam,

it should actually be spam.

Python

```python
precision_score(actual,predicted)
```

Industry Use

- Spam Detection
- Email Filtering
- Recommendation Systems

---

# 3. Recall

Definition

Out of all actual positive cases,

how many did the model identify?

Formula

Recall = TP / (TP + FN)

Question

"How many real positives were found?"

High Recall Means

Very few False Negatives

Example

Cancer Detection

Missing a cancer patient is dangerous.

Therefore recall should be high.

Python

```python
recall_score(actual,predicted)
```

Industry Use

- Disease Detection
- Fraud Detection
- Security Systems

---

# 4. F1 Score

Definition

F1 Score balances Precision and Recall.

Formula

F1 = 2 × Precision × Recall / (Precision + Recall)

Why Needed?

Accuracy alone may be misleading.

F1 combines both Precision and Recall.

Python

```python
f1_score(actual,predicted)
```

Industry Use

- Search Engines
- Recommendation Systems
- Imbalanced Datasets

---

# 5. Confusion Matrix

Definition

Shows detailed prediction results.

| Actual | Predicted | Meaning |
|----------|-----------|----------|
| Positive | Positive | True Positive |
| Positive | Negative | False Negative |
| Negative | Positive | False Positive |
| Negative | Negative | True Negative |

Matrix

```
              Predicted

             Yes   No

Actual Yes   TP    FN

Actual No    FP    TN
```

Python

```python
confusion_matrix(actual,predicted)
```

Importance

Most frequently asked interview topic.

---

# Regression Metrics

---

# 6. MAE

Mean Absolute Error

Definition

Average of absolute prediction errors.

Formula

MAE = Σ |Actual − Predicted| / n

Advantages

- Easy to understand
- Less affected by large errors

Smaller MAE is better.

Python

```python
mean_absolute_error(actual,predicted)
```

Industry Use

House price prediction

---

# 7. MSE

Mean Squared Error

Definition

Average squared prediction error.

Formula

MSE = Σ (Actual − Predicted)² / n

Characteristics

Large mistakes receive higher penalties.

Smaller is better.

Python

```python
mean_squared_error(actual,predicted)
```

Industry Use

Deep Learning

---

# 8. RMSE

Root Mean Squared Error

Definition

Square root of MSE.

Formula

RMSE = √MSE

Advantages

Same unit as original data.

Easy to interpret.

Python

```python
import math

rmse = math.sqrt(mse)
```

Industry Use

Netflix Recommendation System

Weather Forecasting

---

# 9. R² Score

Definition

Measures how well the regression model explains variation in data.

Range

1.0 → Perfect Model

0.0 → Poor Model

Negative → Worse than predicting the average

Formula

R² = 1 − (SSR / SST)

Python

```python
r2_score(actual,predicted)
```

Industry Use

Regression Analysis

Forecasting

Finance

---

# Which Metric Should You Use?

| Problem | Best Metric |
|----------|-------------|
| General Classification | Accuracy |
| Spam Detection | Precision |
| Disease Detection | Recall |
| Fraud Detection | Recall |
| Balanced Classification | F1 Score |
| House Price Prediction | MAE |
| Weather Forecasting | RMSE |
| Regression Quality | R² Score |

---

# Accuracy vs Precision vs Recall

Accuracy

Measures overall correctness.

Precision

Measures correctness of positive predictions.

Recall

Measures ability to detect all positive cases.

---

# Precision vs Recall

Precision

Focuses on reducing False Positives.

Recall

Focuses on reducing False Negatives.

---

# MAE vs MSE vs RMSE

MAE

Simple average error.

MSE

Squares errors.

Punishes large errors.

RMSE

Square root of MSE.

Same unit as data.

Most commonly used.

---

# Interview Questions and Answers

## 1. What is Model Evaluation?

Model Evaluation is the process of measuring how well a machine learning model performs using evaluation metrics.

---

## 2. Why do we need Evaluation Metrics?

They help us compare models and determine whether a model is suitable for real-world use.

---

## 3. What is Accuracy?

Accuracy is the ratio of correct predictions to total predictions.

Formula

Accuracy = Correct Predictions / Total Predictions

---

## 4. When should Accuracy NOT be used?

Accuracy should not be used for highly imbalanced datasets such as fraud detection because it can give misleading results.

---

## 5. What is Precision?

Precision measures how many predicted positive cases are actually positive.

Formula

TP / (TP + FP)

---

## 6. What is Recall?

Recall measures how many actual positive cases are correctly identified.

Formula

TP / (TP + FN)

---

## 7. Difference between Precision and Recall?

Precision reduces False Positives.

Recall reduces False Negatives.

---

## 8. What is F1 Score?

F1 Score is the harmonic mean of Precision and Recall.

It balances both metrics.

---

## 9. What is a Confusion Matrix?

A table showing TP, TN, FP and FN.

It provides complete information about classification performance.

---

## 10. What is TP?

Correctly predicted positive cases.

---

## 11. What is TN?

Correctly predicted negative cases.

---

## 12. What is FP?

Incorrectly predicted positive cases.

Also called False Alarm.

---

## 13. What is FN?

Incorrectly predicted negative cases.

Actual positives missed by the model.

---

## 14. What is MAE?

Average absolute difference between actual and predicted values.

---

## 15. What is MSE?

Average squared difference between actual and predicted values.

Large errors receive larger penalties.

---

## 16. What is RMSE?

Square root of MSE.

It has the same unit as the original data.

---

## 17. What is R² Score?

R² measures how much variance in the target variable is explained by the model.

---

## 18. Which metric is best for Spam Detection?

Precision.

Because we want to avoid marking genuine emails as spam.

---

## 19. Which metric is best for Cancer Detection?

Recall.

Missing a patient is much worse than a false alarm.

---

## 20. Which metric is best for House Price Prediction?

MAE.

It gives average prediction error in actual units.

---

## 21. Which metric is most commonly used in Regression?

RMSE.

Because it penalizes large errors and is easy to interpret.

---

## 22. Which interview topic is asked most frequently?

Confusion Matrix along with Precision, Recall, and F1 Score.

---

# Key Takeaways

- Evaluation metrics determine model performance.
- Classification and Regression use different metrics.
- Accuracy is not always the best metric.
- Precision reduces False Positives.
- Recall reduces False Negatives.
- F1 balances Precision and Recall.
- Confusion Matrix explains every prediction.
- MAE measures average error.
- MSE penalizes large errors.
- RMSE is widely used in industry.
- R² measures regression quality.
- Choosing the correct evaluation metric is as important as choosing the right machine learning algorithm.