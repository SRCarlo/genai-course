# Day 20 Notes – End-to-End Scikit-Learn Project (Student Score Predictor)

---

# Objective

Build a complete Machine Learning project using Scikit-Learn by following the industry-standard workflow:

* Load Dataset
* Preprocess Data
* Split Dataset
* Train Model
* Evaluate Model
* Save Model
* Load Model
* Predict New Values

---

# What is Scikit-Learn?

Scikit-Learn (sklearn) is one of the most popular Python libraries for Machine Learning.

It provides:

* Data preprocessing
* Feature selection
* Model training
* Model evaluation
* Model persistence
* Prediction

---

# Libraries Used

```python
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
```

---

# Project Folder Structure

```
day20_sklearn_project/
│
├── data/
│   └── student_scores.csv
│
├── models/
│   └── student_score_model.pkl
│
├── assignment/
│   └── employee_salary_predictor.py
│
├── notes/
│   └── day20_notes.md
│
├── 01_load_dataset.py
├── 02_preprocessing.py
├── 03_train_model.py
├── 04_evaluate_model.py
├── 05_save_model.py
├── 06_load_model.py
├── 07_predict.py
├── 08_complete_pipeline.py
│
├── requirements.txt
└── README.md
```

---

# Machine Learning Pipeline

```
Dataset
   │
   ▼
Load Data
   │
   ▼
Preprocessing
   │
   ▼
Train/Test Split
   │
   ▼
Train Model
   │
   ▼
Evaluate Model
   │
   ▼
Save Model
   │
   ▼
Load Model
   │
   ▼
Prediction
```

---

# Step 1 — Load Dataset

Read CSV using Pandas.

```python
df = pd.read_csv("data/student_scores.csv")
```

Purpose:

* Read dataset
* Convert into DataFrame
* Prepare for ML

---

# Step 2 — Feature and Target

Independent Variable

```
hours
```

Dependent Variable

```
score
```

Code

```python
X = df[["hours"]]
y = df["score"]
```

Where

* X → Features
* y → Target

---

# Step 3 — Train-Test Split

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)
```

Purpose

* Train on one portion
* Test on unseen data

Benefits

* Prevent overfitting
* Measure model performance
* Reliable evaluation

---

# Step 4 — Train Model

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()

model.fit(X_train, y_train)
```

What happens?

The model learns the relationship between:

```
Study Hours
↓

Score
```

---

# Step 5 — Prediction

```python
predictions = model.predict(X_test)
```

Prediction uses learned patterns to estimate outputs.

---

# Step 6 — Model Evaluation

Mean Absolute Error (MAE)

```python
from sklearn.metrics import mean_absolute_error

mae = mean_absolute_error(
    y_test,
    predictions
)

print(mae)
```

Formula

```
MAE

=

Average of

|Actual - Predicted|
```

Smaller MAE means better predictions.

---

# Step 7 — Save Model

```python
import joblib

joblib.dump(
    model,
    "models/student_score_model.pkl"
)
```

Why save?

Instead of training every time,

```
Train Once

↓

Save Model

↓

Reuse Anytime
```

---

# Step 8 — Load Model

```python
model = joblib.load(
    "models/student_score_model.pkl"
)
```

Now training is not required.

---

# Step 9 — Predict New Data

Correct way:

```python
new_data = pd.DataFrame({
    "hours": [8]
})

prediction = model.predict(new_data)
```

Output

```
Predicted Score: 84.50
```

---

# Important Warning

If trained using

```python
X = df[["hours"]]
```

Don't predict using

```python
model.predict([[8]])
```

Instead use

```python
new_data = pd.DataFrame({
    "hours": [8]
})

model.predict(new_data)
```

Reason:

The model remembers feature names.

---

# Linear Regression

Linear Regression finds the best-fit line.

Equation

```
y = mx + c
```

Where

* y → Prediction
* x → Input
* m → Slope
* c → Intercept

Example

```
Hours

↓

Predicted Score
```

---

# Model Persistence

Model Persistence means saving the trained model.

Benefits

* No retraining
* Faster prediction
* Easy deployment
* Production ready

---

# Joblib

Save

```python
joblib.dump(model, "model.pkl")
```

Load

```python
model = joblib.load("model.pkl")
```

---

# Production Workflow

```
Raw Data

↓

Cleaning

↓

Feature Engineering

↓

Training

↓

Evaluation

↓

Save Model

↓

Deploy

↓

Prediction
```

---

# Real Industry Architecture

```
CSV

↓

Python

↓

Scikit-Learn

↓

Saved Model (.pkl)

↓

FastAPI / Flask

↓

REST API

↓

Node.js

↓

React

↓

User
```

---

# Common Errors

## Feature Name Warning

Wrong

```python
model.predict([[8]])
```

Correct

```python
model.predict(
    pd.DataFrame({
        "hours":[8]
    })
)
```

---

## File Not Found

```
student_score_model.pkl
```

Solution

Run

```
05_save_model.py
```

before prediction.

---

## Wrong Column Name

Wrong

```
Hours
```

Correct

```
hours
```

Feature names are case-sensitive.

---

# Best Practices

* Keep datasets inside `data/`
* Save models inside `models/`
* Use train-test split
* Evaluate before saving
* Save trained model
* Validate user input
* Keep feature names consistent
* Use version control (Git)

---

# Interview Questions & Answers

## 1. What is Scikit-Learn?

Scikit-Learn is a Python library used for building, training, evaluating, and deploying machine learning models.

---

## 2. What is Linear Regression?

A supervised learning algorithm used to predict continuous numerical values.

---

## 3. What is supervised learning?

A learning approach where the model is trained using labeled input-output data.

---

## 4. What are features?

Input variables used by the model.

Example:

```
hours
experience
age
```

---

## 5. What is the target variable?

The value the model predicts.

Example:

```
score
salary
price
```

---

## 6. Why use train_test_split()?

To evaluate model performance on unseen data and reduce overfitting.

---

## 7. What is MAE?

Mean Absolute Error is the average absolute difference between actual and predicted values.

Lower MAE indicates better performance.

---

## 8. What is model training?

The process where an algorithm learns patterns from data.

---

## 9. Why save a model?

* Avoid retraining
* Faster predictions
* Easy deployment
* Reusable

---

## 10. What is a .pkl file?

A serialized file that stores a trained Python object such as a machine learning model.

---

## 11. What does joblib.dump() do?

Saves a trained model to disk.

---

## 12. What does joblib.load() do?

Loads a saved model from disk.

---

## 13. Why is random_state used?

To ensure reproducible train/test splits across runs.

---

## 14. What is overfitting?

When a model performs well on training data but poorly on unseen data.

---

## 15. Difference between training and prediction?

Training:

* Learns patterns from data.

Prediction:

* Uses the learned model to estimate outputs for new data.

---

## 16. How can Node.js use a Python ML model?

Node.js calls a Python service (Flask/FastAPI) through a REST API. The Python service loads the saved model and returns predictions.

---

## 17. Why should prediction data use the same feature names?

Scikit-Learn validates feature names. Using different names (or different capitalization) can produce warnings or errors.

---

## 18. What is a production ML pipeline?

A complete workflow from data collection to deployment and prediction in a real application.

---

# Key Takeaways

* End-to-end ML includes more than training.
* Always evaluate your model before saving it.
* Use consistent feature names.
* Save trained models with Joblib.
* Use DataFrames consistently if the model was trained with DataFrames.
* A `.pkl` file allows models to be reused without retraining.
* This workflow forms the foundation for deploying ML models in web applications and APIs.

---

