# Week 3 Machine Learning Cheat Sheet

---

# Machine Learning

Machine Learning (ML) is a branch of Artificial Intelligence that enables systems to learn patterns from data and make predictions without being explicitly programmed.

---

# Types of Machine Learning

| Type | Description | Algorithms | Examples |
|------|-------------|------------|----------|
| Supervised Learning | Uses labeled data | Linear Regression, Logistic Regression | House Price, Spam Detection |
| Unsupervised Learning | Uses unlabeled data | K-Means | Customer Segmentation |

---

# Machine Learning Workflow

```
Problem Statement
↓
Collect Data
↓
Data Preprocessing
↓
Train-Test Split
↓
Model Training
↓
Model Evaluation
↓
Save Model
↓
Deployment
↓
Prediction
```

---

# Regression

Purpose: Predict continuous numerical values

Algorithm: Linear Regression

Examples:
- House Price Prediction
- Salary Prediction
- Student Score Prediction
- Sales Forecast

Output:
Study Hours → Predicted Score

---

# Classification

Purpose: Predict categories or labels

Algorithm: Logistic Regression

Examples:
- Spam or Not Spam
- Pass or Fail
- Fraud Detection
- Disease Prediction

Output:
Input Features → Category (e.g., PASS)

---

# Clustering

Purpose: Group similar data points

Algorithm: K-Means

Examples:
- Customer Segmentation
- Product Recommendation
- Market Analysis

Output:
Data Point → Cluster ID

---

# Regression vs Classification vs Clustering

| Feature | Regression | Classification | Clustering |
|----------|------------|---------------|------------|
| Learning Type | Supervised | Supervised | Unsupervised |
| Output | Number | Category | Group |
| Labels Required | Yes | Yes | No |
| Algorithm | Linear Regression | Logistic Regression | K-Means |
| Example | House Price | Spam Detection | Customer Segmentation |

---

# Choosing the Right Algorithm

If data has labels:

If output is numerical → Regression

If output is categorical → Classification

If no labels → Clustering

---

# Regression Metrics

| Metric | Description | Goal |
|--------|-------------|------|
| MAE | Mean Absolute Error | Lower is better |
| MSE | Mean Squared Error | Lower is better |
| RMSE | Root Mean Squared Error | Lower is better |
| R² Score | Variance explained | Closer to 1 is better |

---

# Classification Metrics

| Metric | Description |
|--------|-------------|
| Accuracy | Correct predictions / Total predictions |
| Precision | True positives / Predicted positives |
| Recall | True positives / Actual positives |
| F1 Score | Balance of precision and recall |

---

# Scikit-Learn Models

Regression:
LinearRegression

Classification:
LogisticRegression

Clustering:
KMeans

Train-Test Split:
train_test_split

---

# Model Persistence

Save model:
joblib.dump(model, "model.pkl")

Load model:
joblib.load("model.pkl")

---

# Machine Learning Pipeline

User Input
↓
Frontend Application
↓
Backend API
↓
Python ML Model
↓
Trained Model File
↓
Prediction Output
↓
Response to User

---

# Key Concepts

Supervised Learning: Uses labeled data

Unsupervised Learning: Uses unlabeled data

Regression: Predicts numbers

Classification: Predicts categories

Clustering: Finds groups

---

# Interview Revision Questions

What is Machine Learning?
Machine Learning is the process of learning patterns from data to make predictions.

What is Regression?
Regression predicts continuous numerical values.

What is Classification?
Classification predicts categorical outputs.

What is Clustering?
Clustering groups similar data points without labels.

What is Linear Regression?
A model used to predict continuous values using a linear relationship.

What is Logistic Regression?
A model used for binary or multi-class classification.

What is K-Means?
An algorithm that groups data into K clusters based on similarity.

What is Accuracy?
Correct predictions divided by total predictions.

What is Precision?
Correct positive predictions divided by total predicted positives.

What is Recall?
Correct positive predictions divided by total actual positives.

What is F1 Score?
Harmonic mean of precision and recall.

What is MAE?
Average absolute difference between actual and predicted values.

What is RMSE?
Square root of mean squared error.

What is R² Score?
Measures how well the model explains variance in data.

---

# Summary

Regression → Predict numbers  
Classification → Predict categories  
Clustering → Find groups  
Supervised → Labeled data  
Unsupervised → Unlabeled data  

---