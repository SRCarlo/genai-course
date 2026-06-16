# 06_interview_prep.py

questions = [
    "What is AI?",
    "What is Python?",
    "What is a Variable?",
    "What is a List?",
    "What is a Dictionary?",
    "What is a Function?",
    "What is a Loop?",
    "Difference Between List and Tuple?",
    "What is If Statement?"
]

for question in questions:
    print(question)

# DAY 1–6 INTERVIEW ANSWERS (DETAILED)

# 1. What is AI?
#
# AI (Artificial Intelligence) is a branch of computer science
# that enables machines and software to perform tasks that
# normally require human intelligence.
#
# These tasks include:
# - Learning from data
# - Problem-solving
# - Decision-making
# - Understanding language
# - Recognizing images and speech
#
# Examples:
# - ChatGPT
# - Google Assistant
# - Self-driving cars
# - Netflix recommendations
#
# In simple words, AI makes machines smart enough to learn,
# think, and make decisions.

# ------------------------------------------------------------

# 2. What is Python?
#
# Python is a high-level, interpreted, and easy-to-learn
# programming language created by Guido van Rossum in 1991.
#
# Features of Python:
# - Simple and readable syntax
# - Easy for beginners
# - Open source
# - Cross-platform
# - Large community support
#
# Uses of Python:
# - Web Development
# - Artificial Intelligence
# - Machine Learning
# - Data Science
# - Automation
# - Game Development
#
# Example:
#
# print("Hello World")

# ------------------------------------------------------------

# 3. What is a Variable?
#
# A variable is a container used to store data values in memory.
#
# Variables allow us to save information and use it later
# in a program.
#
# Rules:
# - Variable names cannot start with a number.
# - Variable names are case-sensitive.
# - Use meaningful names.
#
# Examples:
#
# name = "Shubham"
# age = 25
# salary = 50000
#
# Here:
# name stores a string.
# age stores an integer.
# salary stores a numeric value.

# ------------------------------------------------------------

# 4. What is a List?
#
# A List is an ordered and mutable (changeable)
# collection in Python.
#
# Lists can store multiple values of different data types.
#
# Characteristics:
# - Ordered
# - Mutable
# - Allows duplicates
# - Indexed
#
# Example:
#
# skills = ["Python", "AI", "Machine Learning"]
#
# Accessing items:
#
# print(skills[0])
#
# Modifying items:
#
# skills[1] = "Data Science"
#
# Common List Methods:
# - append()
# - insert()
# - remove()
# - pop()
# - sort()

# ------------------------------------------------------------

# 5. What is a Dictionary?
#
# A Dictionary is a collection of data stored as
# key-value pairs.
#
# Characteristics:
# - Mutable
# - Unordered (older versions)
# - Fast data retrieval
# - Keys must be unique
#
# Example:
#
# user = {
#     "name": "Shubham",
#     "age": 25,
#     "city": "Pune"
# }
#
# Accessing data:
#
# print(user["name"])
#
# Output:
# Shubham
#
# Common Methods:
# - keys()
# - values()
# - items()
# - get()
# - update()

# ------------------------------------------------------------

# 6. What is a Function?
#
# A Function is a reusable block of code designed
# to perform a specific task.
#
# Benefits:
# - Code reusability
# - Better organization
# - Easier maintenance
#
# Syntax:
#
# def function_name():
#     code
#
# Example:
#
# def greet():
#     print("Hello")
#
# greet()
#
# Functions can also accept parameters:
#
# def greet(name):
#     print("Hello", name)
#
# greet("Shubham")

# ------------------------------------------------------------

# 7. What is a Loop?
#
# A Loop is used to execute a block of code repeatedly.
#
# Types of Loops in Python:
#
# 1. for loop
# 2. while loop
#
# for loop example:
#
# for i in range(5):
#     print(i)
#
# Output:
# 0
# 1
# 2
# 3
# 4
#
# while loop example:
#
# count = 1
#
# while count <= 5:
#     print(count)
#     count += 1
#
# Loops reduce repetitive coding and save time.

# ------------------------------------------------------------

# 8. Difference Between List and Tuple
#
# LIST
# ----
# - Uses square brackets []
# - Mutable (can be modified)
# - Slower than tuple
# - More memory usage
#
# Example:
#
# numbers = [1, 2, 3]
# numbers.append(4)
#
#
# TUPLE
# -----
# - Uses parentheses ()
# - Immutable (cannot be modified)
# - Faster than list
# - Less memory usage
#
# Example:
#
# numbers = (1, 2, 3)
#
# Interview Answer:
#
# A List is mutable and uses square brackets,
# whereas a Tuple is immutable and uses parentheses.

# ------------------------------------------------------------

# 9. What is an If Statement?
#
# An If Statement is used for decision-making in Python.
#
# It executes a block of code only when a condition is True.
#
# Syntax:
#
# if condition:
#     code
#
# Example:
#
# age = 18
#
# if age >= 18:
#     print("Eligible to vote")
#
# Additional forms:
#
# if
# if-else
# if-elif-else
#
# Example:
#
# marks = 75
#
# if marks >= 90:
#     print("Grade A")
# elif marks >= 60:
#     print("Grade B")
# else:
#     print("Grade C")
#
# If statements help programs make intelligent decisions
# based on different conditions.

