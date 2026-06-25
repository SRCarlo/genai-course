# Day 16 Notes — Linear Regression

---

# Introduction

Linear Regression is a supervised machine learning algorithm used to predict continuous numerical values. It learns the relationship between input features and output targets by fitting a best-fit straight line to the data.

It is one of the most important foundational algorithms in machine learning and forms the base for many advanced models.

Example use cases:
- Predict student scores
- Predict house prices
- Predict salaries
- Forecast sales
- Estimate demand

---

# What is Linear Regression?

Linear Regression finds the relationship between input (X) and output (y) using a straight-line equation:

y = mx + c

Where:
- y = predicted output
- x = input feature
- m = slope (weight)
- c = intercept (bias)

---

# Types of Linear Regression

## 1. Simple Linear Regression
- One input feature (X)
- One output variable (y)

Example:
Hours studied → Exam score

---

## 2. Multiple Linear Regression
- Multiple input features
- One output variable

Example:
House size, location, bedrooms → House price

---

# Machine Learning Terminology

---

## 1. Features (X)

Features are input variables used for prediction.

Examples:
- Study hours
- House size
- Experience

Code:
X = df[["hours"]]

Important:
X must always be 2D (table format)

---

## 2. Target (y)

Target is the output variable the model predicts.

Examples:
- Score
- Salary
- Price

Code:
y = df["score"]

Important:
y is 1D (single column)

---

## 3. Model

A mathematical function that learns patterns from data.

In Linear Regression:
The model finds the best values of m and c to minimize error.

---

## 4. Training

Training is the process of learning from data.

Code:
model.fit(X, y)

What happens internally:
- Model tries multiple lines
- Finds best-fit line
- Minimizes error

---

## 5. Prediction

Prediction is generating output for new input.

Code:
model.predict([[8]])

Example:
Input = 8 hours → Output = predicted score

---

# Machine Learning Workflow

1. Load dataset
2. Define X (features) and y (target)
3. Split data into training and testing sets
4. Train model using training data
5. Make predictions
6. Evaluate performance

---

# Train-Test Split

## What is it?

Train-test split divides data into:
- Training data
- Testing data

## Common Split

- 80% training
- 20% testing

## Why it is important?

- Prevents overfitting
- Helps evaluate model on unseen data

---

# Model Training Process

## Step-by-step

1. Initialize model
2. Pass training data
3. Model learns relationship
4. Stores learned coefficients

Code:
model = LinearRegression()
model.fit(X_train, y_train)

---

# Prediction Process

After training:

model.predict(X_new)

Example:
Input: 7 hours  
Output: predicted score

---

# Evaluation Metrics

---

## 1. Mean Absolute Error (MAE)

MAE measures average difference between actual and predicted values.

Formula:
MAE = (1/n) * Σ |actual - predicted|

---

## Interpretation

- Lower MAE → better model
- Higher MAE → worse model

Example:
Actual = 80  
Predicted = 85  
Error = 5

---

# Advantages of Linear Regression

- Simple and easy to understand
- Fast training
- Works well for linear relationships
- Good baseline model

---

# Limitations of Linear Regression

- Assumes linear relationship
- Sensitive to outliers
- Cannot capture complex patterns
- Poor performance on nonlinear data

---

# Real-World Applications

- House price prediction
- Salary prediction
- Sales forecasting
- Demand prediction
- Stock trend estimation

---

# Overfitting

## What is it?

Overfitting occurs when a model memorizes training data instead of learning patterns.

## Characteristics:
- High training accuracy
- Low testing accuracy

---

# Underfitting

## What is it?

Underfitting occurs when a model fails to learn important patterns.

## Characteristics:
- Low training accuracy
- Low testing accuracy

---

# Important Libraries Used

- pandas → data handling
- numpy → numerical operations
- scikit-learn → machine learning models

---

# Interview Questions and Answers

---

## 1. What is Linear Regression?

Linear Regression is a supervised learning algorithm used to predict continuous values by modeling a linear relationship between input and output.

---

## 2. Why is it called Linear Regression?

Because it assumes a straight-line relationship:

y = mx + c

---

## 3. What is supervised learning?

A type of machine learning where the model is trained using labeled data.

---

## 4. What are X and y?

- X = input features
- y = target/output variable

---

## 5. What is model.fit()?

It is used to train the model on data.

---

## 6. What is model.predict()?

It is used to generate predictions on new data.

---

## 7. What is MAE?

Mean Absolute Error measures average prediction error.

Lower MAE = better model.

---

## 8. Why use train-test split?

To evaluate model performance on unseen data and avoid overfitting.

---

## 9. What is overfitting?

When a model performs well on training data but poorly on new data.

---

## 10. Where is Linear Regression used?

- Finance
- Real estate
- Marketing
- Demand forecasting
- Risk analysis

---

# Key Takeaway

Linear Regression is the first real machine learning algorithm where the model learns patterns from data instead of using hardcoded rules. It forms the foundation for advanced machine learning models.