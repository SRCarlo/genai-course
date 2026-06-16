# Day 5 — Loops, Iteration & Data Processing for AI Engineers


## Goal

Learn how AI systems process thousands of records, documents, prompts, embeddings, API responses, and datasets using loops.

## Learning Objectives

By the end of this lesson, you will be able to:

* Understand what loops are and why they are important.
* Use for loops to iterate through collections.
* Use while loops to execute code based on conditions.
* Generate number sequences using range().
* Access index and value using enumerate().
* Understand and implement nested loops.
* Write efficient code using list comprehensions.
* Process datasets, prompts, and documents using loops.
* Understand how AI systems use loops for large-scale data processing.
* Build simple reporting and automation programs.

### Expected Outcome

After completing Day 5, you should be comfortable processing collections of data and understand how loops are used in AI pipelines, backend systems, automation scripts, and data-processing applications.

---

# Introduction to Loops

A loop is a programming construct that repeatedly executes a block of code.

Instead of writing the same statement many times, loops allow us to automate repetitive tasks.

For example, suppose we have thousands of messages.

Without loops:

```python
print(messages[0])
print(messages[1])
print(messages[2])
```

With loops:

```python
for message in messages:
    print(message)
```

The loop automatically processes every item.

---

# Why Loops Matter in AI

AI systems process large amounts of data.

Examples include:

* User prompts
* Chat messages
* Documents
* Training datasets
* Embeddings
* Search results
* API responses
* Database records

Most AI applications process collections of data rather than single values.

### Mental Model

```text
Collection
    ↓
Loop
    ↓
Process Each Item
    ↓
Generate Output
```

Example:

```python
documents = [
    "Python is powerful",
    "AI is the future",
    "Machine Learning is growing"
]

for doc in documents:
    print(doc)
```

---

# For Loop

A for loop is used to iterate through a collection.

## Syntax

```python
for variable in collection:
    # code block
```

## Example

```python
skills = [
    "Python",
    "Node.js",
    "Next.js",
    "AI"
]

for skill in skills:
    print(skill)
```

### Output

```text
Python
Node.js
Next.js
AI
```

### Advantages

* Easy to read
* Simple to use
* Works with lists, tuples, strings, and dictionaries
* Commonly used in AI and data processing

---

# While Loop

A while loop executes as long as a condition remains True.

## Syntax

```python
while condition:
    # code block
```

## Example

```python
count = 1

while count <= 5:
    print(count)
    count += 1
```

### Output

```text
1
2
3
4
5
```

### Use Cases

* Waiting for user input
* Polling APIs
* Chat applications
* Game loops
* Background processes

---

# Infinite Loop

An infinite loop never stops because its condition is always True.

Example:

```python
while True:
    print("Running")
```

Stop using:

```text
Ctrl + C
```

Use infinite loops carefully.

---

# range() Function

range() generates a sequence of numbers.

It is commonly used with loops.

## range(stop)

```python
for num in range(5):
    print(num)
```

Output:

```text
0
1
2
3
4
```

## range(start, stop)

```python
for num in range(1, 6):
    print(num)
```

Output:

```text
1
2
3
4
5
```

## range(start, stop, step)

```python
for num in range(0, 10, 2):
    print(num)
```

Output:

```text
0
2
4
6
8
```

### Parameters

```python
range(start, stop, step)
```

* start → beginning value
* stop → ending value (not included)
* step → increment value

---

# enumerate()

Sometimes we need both the index and the value.

enumerate() provides both.

## Example

```python
skills = [
    "Python",
    "Node.js",
    "AI"
]

for index, skill in enumerate(skills):
    print(index, skill)
```

### Output

```text
0 Python
1 Node.js
2 AI
```

## Custom Starting Index

```python
for index, skill in enumerate(skills, start=1):
    print(index, skill)
```

Output:

```text
1 Python
2 Node.js
3 AI
```

### Use Cases

* Rankings
* Numbered lists
* Position tracking
* Reports

---

# Nested Loops

A nested loop is a loop inside another loop.

## Example

```python
for i in range(3):
    for j in range(2):
        print(i, j)
```

### Output

```text
0 0
0 1
1 0
1 1
2 0
2 1
```

### Mental Model

```text
Outer Loop
    ↓
Inner Loop
    ↓
Runs Completely
```

---

# AI Examples of Nested Loops

## Users and Messages

```python
users = [
    ["Hello", "How are you?"],
    ["What is AI?", "Explain ML"]
]

for user in users:
    for message in user:
        print(message)
```

## Documents and Paragraphs

```python
documents = [
    ["Paragraph 1", "Paragraph 2"],
    ["Paragraph A", "Paragraph B"]
]

for document in documents:
    for paragraph in document:
        print(paragraph)
```

---

# List Comprehension

List comprehension is a concise and Pythonic way to create lists.

## Traditional Method

```python
numbers = []

for num in range(5):
    numbers.append(num)

print(numbers)
```

Output:

```python
[0, 1, 2, 3, 4]
```

## List Comprehension

```python
numbers = [
    num
    for num in range(5)
]
```

Output:

```python
[0, 1, 2, 3, 4]
```

## Square Numbers

```python
squares = [
    num * num
    for num in range(5)
]
```

Output:

```python
[0, 1, 4, 9, 16]
```

## Conditional List Comprehension

```python
even_numbers = [
    num
    for num in range(10)
    if num % 2 == 0
]
```

Output:

```python
[0, 2, 4, 6, 8]
```

---

# AI Data Processing

Real AI applications process large datasets using loops.

Example:

```python
documents = [
    "Python is powerful",
    "AI is the future",
    "Node.js is scalable"
]

for doc in documents:
    print(doc.upper())
```

Output:

```text
PYTHON IS POWERFUL
AI IS THE FUTURE
NODE.JS IS SCALABLE
```

---

# Prompt Preprocessing

Before sending prompts to AI models, prompts are often cleaned or transformed.

Example:

```python
prompts = [
    "what is ai",
    "what is ml",
    "what is llm"
]

processed = [
    prompt.upper()
    for prompt in prompts
]

print(processed)
```

Output:

```python
['WHAT IS AI', 'WHAT IS ML', 'WHAT IS LLM']
```

---

# Interview Questions & Answers

## 1. What is a loop?

A loop is a programming construct that repeatedly executes a block of code until a condition is met or all items in a collection have been processed.

### Why is it useful?

Loops reduce repetitive code and automate repetitive tasks.

---

## 2. Why are loops important in AI?

Loops are important because AI systems process large amounts of data.

Examples:

* Documents
* Prompts
* Datasets
* Embeddings
* API responses

Without loops, processing large collections of data would be difficult and inefficient.

---

## 3. What is a for loop?

A for loop is used to iterate through collections such as lists, strings, tuples, and dictionaries.

Example:

```python
for skill in skills:
    print(skill)
```

A for loop is preferred when the number of iterations is known.

---

## 4. What is a while loop?

A while loop executes as long as a condition remains True.

Example:

```python
while count <= 5:
    print(count)
```

A while loop is useful when the number of iterations is not known beforehand.

---

## 5. What is range()?

range() is a built-in Python function that generates a sequence of numbers.

Example:

```python
for num in range(5):
    print(num)
```

It is commonly used with for loops.

---

## 6. What is enumerate()?

enumerate() returns both the index and the value while iterating through a collection.

Example:

```python
for index, skill in enumerate(skills):
    print(index, skill)
```

It is useful for numbering and ranking items.

---

## 7. What is a nested loop?

A nested loop is a loop inside another loop.

Example:

```python
for row in matrix:
    for item in row:
        print(item)
```

Nested loops are useful for processing multi-level data structures.

---

## 8. What is list comprehension?

List comprehension is a concise way to create lists.

Example:

```python
squares = [x * x for x in range(5)]
```

Benefits:

* Cleaner syntax
* Better readability
* Often faster than traditional loops

---

## 9. Difference Between for Loop and while Loop

### For Loop

* Used when iterations are known.
* Commonly used with collections.
* Easier to read and maintain.

### While Loop

* Used when execution depends on a condition.
* More flexible.
* Can accidentally create infinite loops if not handled correctly.

---

## 10. Difference Between append() and extend()

### append()

Adds a single item to a list.

Example:

```python
numbers = [1, 2]

numbers.append([3, 4])

print(numbers)
```

Output:

```python
[1, 2, [3, 4]]
```

### extend()

Adds multiple items individually.

Example:

```python
numbers = [1, 2]

numbers.extend([3, 4])

print(numbers)
```

Output:

```python
[1, 2, 3, 4]
```

---

## 11. How are loops used in AI?

Loops are used in:

### Prompt Processing

```python
for prompt in prompts:
    process(prompt)
```

### Document Processing

```python
for document in documents:
    process(document)
```

### Embedding Generation

```python
for text in texts:
    embedding = model.embed(text)
```

### API Response Processing

```python
for response in responses:
    print(response)
```

### Dataset Processing

```python
for record in dataset:
    train(record)
```

AI systems rely heavily on loops because they process large collections of data.

---

# Key Takeaways

* Loops automate repetitive tasks.
* for loops iterate over collections.
* while loops execute based on conditions.
* range() generates sequences of numbers.
* enumerate() provides both index and value.
* Nested loops process multi-level data.
* List comprehensions create lists efficiently.
* AI pipelines heavily depend on loops.
* Data processing is a core AI engineering skill.

---

# Revision Checklist

* [ ] for loop
* [ ] while loop
* [ ] range()
* [ ] enumerate()
* [ ] nested loops
* [ ] list comprehension
* [ ] AI data processing
* [ ] prompt preprocessing
* [ ] interview questions
* [ ] append vs extend

## Important Note

Almost every AI application uses loops to process prompts, documents, embeddings, datasets, API responses, and user interactions.

Mastering loops is a fundamental skill for becoming an AI Engineer.
