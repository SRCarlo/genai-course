"""
Day 15 Assignment
Customer Purchase Predictor

Inputs:
1. Age
2. Salary
3. Years of Experience

Output:
Purchase Probability
Purchase Chance Category
"""

print("_______________________CUSTOMER PURCHASE PREDICTOR______________________________\n")

# Input
age = int(input("Enter Customer Age: "))
salary = float(input("Enter Customer Salary: "))
experience = int(input("Enter Years of Experience: "))

# Data Cleaning
if age < 0:
    age = 0

if salary < 0:
    salary = 0

if experience < 0:
    experience = 0

# Feature Engineering
salary_score = salary / 1000

# Prediction Formula
probability = age + salary_score + experience

print("______________________________________\n")
print(f"Purchase Probability Score: {probability:.2f}")

# Bonus Classification
if probability >= 100:
    chance = "HIGH PURCHASE CHANCE"
elif probability >= 60:
    chance = "MEDIUM PURCHASE CHANCE"
else:
    chance = "LOW PURCHASE CHANCE"

print(f"Prediction: {chance}")
print("__________________________________")