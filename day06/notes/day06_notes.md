# Day 6 Notes - Conditional Statements, Validation and Decision Making

## Objective

Learn how programs make decisions using conditional statements. Conditional logic is used in backend development, AI systems, authentication, APIs, chatbots, and access control systems.

By the end of this lesson, you will be able to:

* Use if statements
* Use if-else statements
* Use if-elif-else statements
* Use comparison operators
* Use logical operators
* Validate user input
* Build a simple login system
* Create a basic AI prompt filter
* Understand AI guardrails and access control

---

# 1. What is a Conditional Statement?

A conditional statement allows a program to make decisions based on whether a condition is true or false.

## Example

```python
age = 20

if age >= 18:
    print("Eligible")
```

### Output

```text
Eligible
```

## Real-World Examples

### YouTube

```text
If age >= 18
    Show content
Else
    Restrict content
```

### AI Chatbot

```text
If prompt is safe
    Generate response
Else
    Block request
```

---

# 2. If Statement

An if statement executes a block of code only when a condition is true.

## Syntax

```python
if condition:
    # code to execute
```

## Example

```python
age = 25

if age >= 18:
    print("Access Granted")
```

### Output

```text
Access Granted
```

---

# 3. If Else Statement

An else block executes when the condition in the if statement is false.

## Syntax

```python
if condition:
    # code
else:
    # code
```

## Example

```python
age = 16

if age >= 18:
    print("Eligible")
else:
    print("Not Eligible")
```

### Output

```text
Not Eligible
```

---

# 4. If Elif Else Statement

Used when multiple conditions need to be checked.

## Syntax

```python
if condition1:
    pass

elif condition2:
    pass

else:
    pass
```

## Example

```python
marks = 85

if marks >= 90:
    print("A Grade")

elif marks >= 75:
    print("B Grade")

elif marks >= 60:
    print("C Grade")

else:
    print("Fail")
```

### Output

```text
B Grade
```

---

# 5. Comparison Operators

Comparison operators compare values and return either True or False.

| Operator | Meaning                  |
| -------- | ------------------------ |
| ==       | Equal To                 |
| !=       | Not Equal To             |
| >        | Greater Than             |
| <        | Less Than                |
| >=       | Greater Than or Equal To |
| <=       | Less Than or Equal To    |

## Examples

```python
print(10 == 10)
print(10 != 5)
print(20 > 10)
print(5 < 10)
print(20 >= 20)
print(10 <= 20)
```

### Output

```text
True
True
True
True
True
True
```

---

# 6. Logical Operators

Logical operators combine multiple conditions.

## AND Operator

Returns True only when all conditions are True.

### Example

```python
age = 25
salary = 50000

if age > 18 and salary > 30000:
    print("Loan Approved")
```

### Truth Table

```text
True and True = True
True and False = False
False and True = False
False and False = False
```

---

## OR Operator

Returns True if at least one condition is True.

### Example

```python
age = 17
salary = 50000

if age > 18 or salary > 30000:
    print("Approved")
```

### Truth Table

```text
True or True = True
True or False = True
False or True = True
False or False = False
```

---

## NOT Operator

Reverses the result.

### Example

```python
is_blocked = False

if not is_blocked:
    print("Access Granted")
```

### Output

```text
Access Granted
```

---

# 7. Input Validation

Input validation ensures that users enter valid and expected data.

## Example

```python
age = int(input("Enter Age: "))

if age >= 18:
    print("Access Granted")
else:
    print("Access Denied")
```

## Importance of Input Validation

* Prevents invalid data
* Improves security
* Prevents application errors
* Improves user experience
* Makes applications more reliable

---

# 8. AI Prompt Filter

Prompt filtering is a simple form of AI safety.

## Example

```python
prompt = input("Enter Prompt: ")

blocked_words = [
    "hack",
    "virus",
    "malware"
]

if prompt.lower() in blocked_words:
    print("Prompt Blocked")
else:
    print("Prompt Accepted")
```

## Uses in AI

* Prompt validation
* Safety systems
* Content moderation
* AI guardrails

---

# 9. Login System

A login system verifies user credentials before granting access.

## Example

```python
username = "admin"
password = "1234"

user = input("Username: ")
pwd = input("Password: ")

if user == username and pwd == password:
    print("Login Successful")
else:
    print("Invalid Credentials")
```

### Output

```text
Username: admin
Password: 1234

Login Successful
```

---

# 10. AI Access Control Assignment

## Problem Statement

Ask the user for:

* Name
* Age
* Subscription Type

Grant access only when:

* Age is 18 or above
* Subscription type is Premium

Otherwise deny access.

## Solution

```python
name = input("Enter Name: ")
age = int(input("Enter Age: "))
subscription = input("Enter Subscription Type: ").lower()

if age >= 18 and subscription == "premium":
    print("Access Granted")
    print(f"Welcome Premium User, {name}")
else:
    print("Access Denied")
```

---

# 11. Python vs Node.js

## Python

```python
if age >= 18:
    print("Allowed")
```

## Node.js

```javascript
if (age >= 18) {
    console.log("Allowed");
}
```

---

## Python

```python
if user == "admin":
    print("Welcome")
```

## Node.js

```javascript
if (user === "admin") {
    console.log("Welcome");
}
```

---

# 12. AI Industry Use Cases

## Prompt Validation

```python
if len(prompt) > 5000:
    reject()
```

## User Authentication

```python
if token_valid:
    access()
```

## Agent Decision Making

```python
if confidence > 0.8:
    answer()
else:
    search_more()
```

## RAG Filtering

```python
if similarity > 0.75:
    retrieve_document()
```

## Content Moderation

```python
if harmful_content:
    block()
```

---

# Interview Questions and Answers

## 1. What is an if statement?

Answer:

An if statement executes a block of code only when a condition evaluates to True.

Example:

```python
if age >= 18:
    print("Eligible")
```

---

## 2. What is the difference between if and else?

Answer:

* if executes when the condition is True.
* else executes when the condition is False.

Example:

```python
if age >= 18:
    print("Allowed")
else:
    print("Denied")
```

---

## 3. What is elif?

Answer:

elif means "else if".

It is used to check multiple conditions in sequence.

Example:

```python
if marks >= 90:
    print("A Grade")
elif marks >= 75:
    print("B Grade")
else:
    print("Fail")
```

---

## 4. What are comparison operators?

Answer:

Comparison operators compare two values and return True or False.

Examples:

```text
==
!=
>
<
>=
<=
```

---

## 5. What is the AND operator?

Answer:

The AND operator returns True only when all conditions are True.

Example:

```python
if age > 18 and salary > 30000:
    print("Approved")
```

---

## 6. What is the OR operator?

Answer:

The OR operator returns True if at least one condition is True.

Example:

```python
if age > 18 or salary > 30000:
    print("Approved")
```

---

## 7. What is the NOT operator?

Answer:

The NOT operator reverses a Boolean value.

Example:

```python
is_blocked = False

if not is_blocked:
    print("Access Granted")
```

---

## 8. Why is input validation important?

Answer:

Input validation ensures only valid data enters the system.

Benefits include:

* Better security
* Fewer errors
* Improved reliability
* Better user experience

---

## 9. How do AI systems use conditional logic?

Answer:

AI systems use conditional logic for:

* Prompt filtering
* User authentication
* Access control
* Content moderation
* AI agent decisions
* Document retrieval
* Safety guardrails

---

## 10. What is Authentication?

Answer:

Authentication is the process of verifying a user's identity before granting access to a system.

Example:

```python
if username == "admin" and password == "1234":
    print("Login Successful")
```

---

## 11. What is Access Control?

Answer:

Access control determines whether a user has permission to use a specific feature, resource, or system.

---

## 12. What are AI Guardrails?

Answer:

AI guardrails are safety mechanisms that prevent harmful, unsafe, or restricted actions.

Examples include:

* Prompt filtering
* Content moderation
* User validation
* Access restrictions

---

# Key Learning

* Conditional statements help programs make decisions.
* if, else, and elif are the foundation of program logic.
* Comparison operators compare values.
* Logical operators combine conditions.
* Validation improves application security and reliability.
* Authentication systems use conditional logic.
* AI guardrails depend heavily on conditional statements.
* Every AI system uses decision-making logic.


Conditional logic is one of the most important foundations of Python programming, backend development, AI applications, APIs, authentication systems, and intelligent agents.
