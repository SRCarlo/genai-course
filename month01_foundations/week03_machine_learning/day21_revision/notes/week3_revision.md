# Week 3 Revision - Machine Learning

# 1. What is Machine Learning?

Machine Learning (ML) is a branch of Artificial Intelligence (AI) that enables computers to learn patterns from data and make predictions or decisions without being explicitly programmed for every task.

Instead of writing fixed rules, we train a model using data.

### Examples

- House Price Prediction
- Email Spam Detection
- Customer Segmentation
- Product Recommendation
- Disease Prediction

---

# 2. Types of Machine Learning

## Supervised Learning

Uses labeled data.

The model learns from input features and known outputs.

Examples:

- House Price Prediction
- Student Score Prediction
- Spam Detection

Algorithms:

- Linear Regression
- Logistic Regression

---

## Unsupervised Learning

Uses unlabeled data.

The model finds hidden patterns or groups.

Examples:

- Customer Segmentation
- Market Basket Analysis

Algorithm:

- K-Means Clustering

---

# 3. Machine Learning Workflow

A complete ML project follows these steps:

Problem

↓

Collect Data

↓

Preprocess Data

↓

Split Dataset

↓

Train Model

↓

Evaluate Model

↓

Save Model

↓

Deploy Model

↓

Prediction

### Step Explanation

### Problem Statement

Clearly define what needs to be predicted.

Example:

Predict student scores based on study hours.

---

### Data Collection

Collect relevant data from:

- CSV Files
- Databases
- APIs
- Surveys

---

### Data Preprocessing

Prepare the data.

Tasks include:

- Handle missing values
- Remove duplicates
- Encode categorical values
- Feature scaling

---

### Train-Test Split

Split data into:

- Training Data
- Testing Data

Common ratio:

80% Training

20% Testing

---

### Model Training

Choose an algorithm.

Examples:

- Linear Regression
- Logistic Regression
- K-Means

Train the model using training data.

---

### Model Evaluation

Evaluate model performance.

Regression Metrics:

- MAE
- MSE
- RMSE
- R² Score

Classification Metrics:

- Accuracy
- Precision
- Recall
- F1 Score

---

### Save Model

Store the trained model using Joblib.

Example:

```python
joblib.dump(model, "model.pkl")
```

---

### Deployment

Deploy the model using:

- Flask
- FastAPI
- Django
- Node.js + Python API

---

### Prediction

Users enter new data.

The model predicts the output.

---

# 4. Regression

Regression predicts continuous numerical values.

Examples

- House Price
- Salary
- Temperature
- Student Score
- Sales Forecast

Algorithm

Linear Regression

Example

Study Hours → Score

5 Hours → 58 Marks

---

# 5. Classification

Classification predicts categories.

Examples

- Pass / Fail
- Spam / Not Spam
- Fraud / Safe
- Healthy / Diseased

Algorithm

Logistic Regression

Example

Hours = 7

Attendance = 85%

Prediction → PASS

---

# 6. Clustering

Clustering groups similar data together.

No labels are required.

Algorithm

K-Means

Examples

- Customer Segmentation
- Product Recommendation
- Market Analysis

Output Example

Customer → Cluster 2

---

# 7. Evaluation Metrics

## Regression Metrics

### MAE (Mean Absolute Error)

Average absolute difference between actual and predicted values.

Lower MAE is better.

---

### MSE (Mean Squared Error)

Average squared error.

Punishes large errors more than MAE.

Lower MSE is better.

---

### RMSE (Root Mean Squared Error)

Square root of MSE.

Easy to understand because it is in the same unit as the target.

Lower RMSE is better.

---

### R² Score

Measures how well the model explains the data.

Range:

0 → Poor

1 → Perfect

Higher is better.

---

## Classification Metrics

### Accuracy

Correct Predictions / Total Predictions

Higher accuracy is better.

---

### Precision

Of all predicted positives,

how many were actually positive?

Use when False Positives are costly.

Example:

Spam Detection

---

### Recall

Of all actual positives,

how many were correctly identified?

Use when False Negatives are costly.

Example:

Disease Detection

---

### F1 Score

Harmonic mean of Precision and Recall.

Useful when classes are imbalanced.

---

# 8. Regression vs Classification vs Clustering

| Feature | Regression | Classification | Clustering |
|----------|------------|---------------|------------|
| Learning | Supervised | Supervised | Unsupervised |
| Output | Number | Category | Group |
| Labels Required | Yes | Yes | No |
| Algorithm | Linear Regression | Logistic Regression | K-Means |
| Example | House Price | Spam Detection | Customer Segmentation |

---

# 9. Choosing the Right Algorithm

Do you have labeled data?

YES

↓

Need numerical output?

↓

YES → Regression

↓

NO → Classification

NO LABELS

↓

Clustering

---

# 10. Industry ML Pipeline

User

↓

Frontend

↓

REST API

↓

Python ML Service

↓

Saved Model (.pkl)

↓

Prediction

↓

JSON Response

---

# Interview Questions and Answers

## 1. What is Machine Learning?

Machine Learning is a branch of Artificial Intelligence that enables computers to learn patterns from data and make predictions without being explicitly programmed.

---

## 2. What is the Machine Learning Workflow?

Problem → Collect Data → Preprocess → Split Dataset → Train Model → Evaluate Model → Save Model → Deploy → Prediction.

---

## 3. What is Supervised Learning?

Supervised Learning uses labeled data to train models.

Examples:

- Regression
- Classification

---

## 4. What is Unsupervised Learning?

Unsupervised Learning works with unlabeled data and discovers hidden patterns.

Example:

Customer Segmentation

---

## 5. What is Regression?

Regression predicts continuous numerical values.

Example:

House Price Prediction.

---

## 6. What is Classification?

Classification predicts categories.

Example:

Spam or Not Spam.

---

## 7. What is Clustering?

Clustering groups similar data points without labels.

Example:

Customer Segmentation.

---

## 8. What is Linear Regression?

A supervised learning algorithm used to predict continuous numerical values.

---

## 9. What is Logistic Regression?

A supervised learning algorithm used for binary or multi-class classification.

---

## 10. What is K-Means?

An unsupervised algorithm that divides data into K clusters based on similarity.

---

## 11. What is Accuracy?

Accuracy is the ratio of correctly predicted observations to total observations.

Formula:

Accuracy = Correct Predictions / Total Predictions

---

## 12. What is Precision?

Precision measures how many predicted positive values are actually positive.

---

## 13. What is Recall?

Recall measures how many actual positive values are correctly predicted.

---

## 14. What is F1 Score?

F1 Score is the harmonic mean of Precision and Recall.

---

## 15. What is MAE?

Mean Absolute Error is the average absolute difference between actual and predicted values.

---

## 16. What is MSE?

Mean Squared Error is the average squared difference between actual and predicted values.

---

## 17. What is RMSE?

Root Mean Squared Error is the square root of MSE.

---

## 18. What is R² Score?

R² Score measures how well the regression model explains the variation in data.

Higher R² indicates a better model.

---
