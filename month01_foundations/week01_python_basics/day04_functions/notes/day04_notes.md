# Day 4: Functions, Parameters, Return Values & Reusable AI Code

## Learning Objectives

By the end of Day 4, you should be able to:

* Understand what functions are and why they are important.
* Create and call functions.
* Use parameters and arguments.
* Return values from functions.
* Understand variable scope.
* Use lambda functions.
* Build reusable code modules.
* Understand how functions are used in AI and backend development.

---

# 1. What is a Function?

A function is a reusable block of code designed to perform a specific task.

Instead of writing the same code repeatedly, we can place that code inside a function and call it whenever needed.

## Without Functions

```python
print("Hello")
print("Hello")
print("Hello")
print("Hello")
```

### Problems

* Repeated code
* Difficult to maintain
* More chances of bugs
* Hard to update

---

## With Functions

```python
def greet():
    print("Hello")

greet()
greet()
greet()
```

### Output

```text
Hello
Hello
Hello
```

### Benefits

* Code reuse
* Cleaner code
* Easier maintenance
* Better organization

---

# 2. Mental Model of a Function

Think of a function as a machine.

```text
Input
  ↓
Function
  ↓
Output
```

### Tea Machine Example

```text
Water + Tea + Sugar
          ↓
      Machine
          ↓
         Tea
```

### Function Example

```text
Data
 ↓
Function Logic
 ↓
Result
```

---

# 3. Creating Your First Function

## Syntax

```python
def function_name():
    code
```

### Example

```python
def welcome():
    print("Welcome to GenAI Engineering")

welcome()
```

### Output

```text
Welcome to GenAI Engineering
```

### Explanation

* `def` means define a function.
* `welcome` is the function name.
* Parentheses `()` are required.
* Indented code belongs to the function.
* The function runs only when called.

---

# 4. Parameters

Parameters allow functions to receive input.

### Example

```python
def greet(name):
    print(f"Hello {name}")

greet("Shubham")
```

### Output

```text
Hello Shubham
```

### Explanation

* `name` is a parameter.
* It receives data when the function is called.

---

## Multiple Parameters

```python
def student(name, age):
    print(name)
    print(age)

student("Shubham", 24)
```

### Output

```text
Shubham
24
```

### Why Parameters Matter

Without parameters:

```python
def greet():
    print("Hello Shubham")
```

Only works for one person.

With parameters:

```python
def greet(name):
    print(f"Hello {name}")
```

Works for anyone.

---

# 5. Arguments

Arguments are the actual values passed to a function.

### Example

```python
def greet(name):
    print(name)

greet("Rahul")
```

### Explanation

* `name` → Parameter
* `"Rahul"` → Argument

---

# 6. Return Values

One of the most important concepts in programming.

## Bad Example

```python
def add(a, b):
    print(a + b)
```

Problem:

```python
result = add(10, 20)
```

Result becomes:

```python
None
```

because nothing is returned.

---

## Good Example

```python
def add(a, b):
    return a + b

result = add(10, 20)

print(result)
```

### Output

```text
30
```

---

## Why Return is Important

Return allows:

* Storing results
* Reusing values
* Performing calculations
* Building AI pipelines

Example:

```python
total = add(10, 20)

final = total * 2

print(final)
```

Output:

```text
60
```

---

# 7. Return Mental Model

Think of an ATM.

```text
Request Money
      ↓
      ATM
      ↓
Returns Cash
```

Similarly:

```text
Input
 ↓
Function
 ↓
Returns Result
```

---

# 8. Functions in AI

Functions are used everywhere in AI systems.

### Example

```python
def generate_prompt(topic):
    return f"Explain {topic} in simple words"
```

Usage:

```python
prompt = generate_prompt("Artificial Intelligence")

print(prompt)
```

Output:

```text
Explain Artificial Intelligence in simple words
```

---

# 9. Variable Scope

Scope determines where variables can be accessed.

---

## Global Scope

Variables declared outside functions.

```python
company = "OpenAI"

def show():
    print(company)

show()
```

### Output

```text
OpenAI
```

Global variables can usually be accessed inside functions.

---

## Local Scope

Variables declared inside functions.

```python
def show():
    city = "Nagpur"

print(city)
```

### Output

```text
NameError
```

Reason:

`city` only exists inside the function.

---

## Scope Example

```python
company = "OpenAI"

def employee():
    name = "Shubham"

    print(name)
    print(company)

employee()
```

### Output

```text
Shubham
OpenAI
```

---

# 10. Lambda Functions

Lambda functions are short anonymous functions.

---

## Normal Function

```python
def square(num):
    return num * num
```

---

## Lambda Version

```python
square = lambda num: num * num

print(square(5))
```

### Output

```text
25
```

---

## Another Example

```python
multiply = lambda a, b: a * b

print(multiply(4, 5))
```

Output:

```text
20
```

---

# 11. AI Prompt Function Example

```python
def create_prompt(topic):
    return f"Teach me {topic} like a beginner."

prompt = create_prompt("Machine Learning")

print(prompt)
```

### Output

```text
Teach me Machine Learning like a beginner.
```

This is similar to how AI applications dynamically generate prompts.

---

# 12. Mini Project: Student Manager

```python
students = []

def add_student(name, age):
    student = {
        "name": name,
        "age": age
    }

    students.append(student)

def show_students():
    for student in students:
        print(student)

add_student("Shubham", 24)
add_student("Rahul", 22)

show_students()
```

### Output

```text
{'name': 'Shubham', 'age': 24}
{'name': 'Rahul', 'age': 22}
```

### Concepts Used

* Functions
* Parameters
* Lists
* Dictionaries
* Reusability

---

# 13. Functions in Real AI Systems

Real AI applications are built using multiple functions.

Example:

```python
def generate_embedding(text):
    pass

def store_embedding(vector):
    pass

def search_documents(query):
    pass

def generate_answer(context):
    pass
```

### AI Pipeline

```text
User Query
     ↓
Search Documents
     ↓
Generate Context
     ↓
Generate Answer
     ↓
Return Response
```

Each step is usually a separate function.

---

# Day 4 Interview Questions & Answers

## 1. What is a function?

A reusable block of code that performs a specific task.

---

## 2. Why do we use functions?

* Reusability
* Cleaner code
* Easier maintenance
* Easier debugging
* Better organization

---

## 3. What is a parameter?

A value accepted by a function.

Example:

```python
def greet(name):
    print(name)
```

`name` is a parameter.

---

## 4. What is an argument?

The actual value passed to a function.

Example:

```python
greet("Shubham")
```

`"Shubham"` is an argument.

---

## 5. What is return?

Used to send a value back from a function.

---

## 6. Difference Between print() and return?

| print()             | return           |
| ------------------- | ---------------- |
| Displays output     | Returns value    |
| Cannot reuse easily | Can reuse result |
| Used for display    | Used for logic   |

---

## 7. What is scope?

Scope determines where a variable can be accessed.

Types:

* Global Scope
* Local Scope

---

## 8. What is a global variable?

A variable declared outside a function and accessible throughout the program.

---

## 9. What is a local variable?

A variable declared inside a function and accessible only within that function.

---

## 10. What is a Lambda Function?

A one-line anonymous function.

Example:

```python
square = lambda x: x * x
```

---

## 11. Why are functions important in AI?

Functions divide AI applications into reusable modules.

Examples:

* Prompt Generation
* Embedding Generation
* Data Processing
* Document Retrieval
* Response Generation

---

# Key Takeaways

* Functions help write reusable code.
* Parameters receive inputs.
* Arguments pass values.
* Return sends results back.
* Scope controls variable accessibility.
* Lambda functions provide concise syntax.
* Functions are fundamental in AI, backend development, APIs, and machine learning pipelines.
* Every large AI system is built using hundreds or thousands of reusable functions.
