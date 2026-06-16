# DAY 3 — PYTHON COLLECTIONS FOR AI ENGINEERS

## 1. What are Python Collections?

Python Collections are data structures used to store and organize multiple values in a single variable.

The four main collection types in Python are:

* List
* Tuple
* Set
* Dictionary

These collections help developers manage and process data efficiently.

**Example:**

```python
skills = ["Python", "AI"]
location = (18.5204, 73.8567)
numbers = {1, 2, 3}
user = {"name": "Shubham"}
```

---

## 2. What is a List in Python?

A List is an ordered and mutable collection used to store multiple values.

Lists allow adding, updating, and removing elements after creation.

**Example:**

```python
skills = ["Python", "Node.js", "AI"]

print(skills)
```

**Output:**

```python
['Python', 'Node.js', 'AI']
```

---

## 3. Why are Lists important in AI?

Lists are widely used in AI because they can store sequences of data such as:

* Tokens
* Messages
* Embeddings
* Training data

**Example:**

```python
tokens = ["hello", "world"]

embeddings = [0.22, 0.67, 0.91]
```

---

## 4. How do you access items in a List?

List items are accessed using indexes.

Indexing starts from 0.

**Example:**

```python
skills = ["Python", "Node.js", "AI"]

print(skills[0])
```

**Output:**

```python
Python
```

---

## 5. What is negative indexing?

Negative indexing allows access to elements from the end of a list.

**Example:**

```python
skills = ["Python", "Node.js", "AI"]

print(skills[-1])
```

**Output:**

```python
AI
```

---

## 6. How do you add and remove items from a List?

Use:

* `append()` to add
* `remove()` to delete

**Example:**

```python
skills = ["Python", "Node.js"]

skills.append("AI")

skills.remove("Node.js")

print(skills)
```

**Output:**

```python
['Python', 'AI']
```

---

## 7. How do you find the length of a List?

The `len()` function returns the total number of items.

**Example:**

```python
skills = ["Python", "Node.js", "AI"]

print(len(skills))
```

**Output:**

```python
3
```

---

## 8. What is a Tuple in Python?

A Tuple is an ordered and immutable collection.

Once created, tuple values cannot be modified.

**Example:**

```python
location = (18.5204, 73.8567)

print(location)
```

**Output:**

```python
(18.5204, 73.8567)
```

---

## 9. What does immutable mean?

Immutable means the data cannot be changed after creation.

**Example:**

```python
location = (18.5204, 73.8567)

location[0] = 10
```

**Output:**

```python
TypeError
```

---

## 10. When should you use a Tuple?

Use Tuples when data should remain fixed.

Examples:

* Coordinates
* RGB values
* Screen resolution
* API versions

**Example:**

```python
rgb = (255, 0, 0)
```

---

## 11. What is a Set in Python?

A Set is an unordered collection that stores only unique values.

Duplicate values are automatically removed.

**Example:**

```python
numbers = {1, 2, 2, 3, 3, 4}

print(numbers)
```

**Output:**

```python
{1, 2, 3, 4}
```

---

## 12. Why are Sets useful in AI?

Sets help remove duplicate data from datasets, keywords, and tags.

**Example:**

```python
keywords = [
    "AI",
    "Python",
    "AI"
]

unique_keywords = set(keywords)

print(unique_keywords)
```

**Output:**

```python
{'AI', 'Python'}
```

---

## 13. What is a Dictionary in Python?

A Dictionary stores data in key-value pairs.

Each key is used to access a specific value.

**Example:**

```python
user = {
    "name": "Shubham",
    "age": 24
}
```

---

## 14. Why are Dictionaries important in AI?

Most AI APIs return data in JSON format, which becomes a Dictionary in Python.

Examples include:

* API responses
* User information
* Model outputs

**Example:**

```python
response = {
    "id": "123",
    "model": "gpt",
    "message": "Hello"
}
```

---

## 15. How do you access values in a Dictionary?

Use the key name.

**Example:**

```python
user = {
    "name": "Shubham",
    "age": 24
}

print(user["name"])
```

**Output:**

```python
Shubham
```

---

## 16. How do you add, update, and delete data in a Dictionary?

### Add

```python
user["city"] = "Pune"
```

### Update

```python
user["age"] = 25
```

### Delete

```python
del user["age"]
```

---

## 17. What is Nested Data?

Nested data means one collection exists inside another collection.

Real-world AI applications use nested data extensively.

**Example:**

```python
user = {
    "name": "Shubham",
    "skills": [
        "Python",
        "AI"
    ]
}
```

---

## 18. How do you access Nested Data?

Use a combination of keys and indexes.

**Example:**

```python
user = {
    "name": "Shubham",
    "skills": ["Python", "AI"]
}

print(user["skills"][0])
```

**Output:**

```python
Python
```

---

## 19. What is a List of Dictionaries?

A List of Dictionaries stores multiple records.

Each item in the list is a dictionary.

**Example:**

```python
employees = [
    {
        "name": "Shubham",
        "role": "AI Engineer"
    },
    {
        "name": "Rahul",
        "role": "Backend Developer"
    }
]
```

---

## 20. What data structure is used by ChatGPT APIs?

ChatGPT APIs use a List of Dictionaries.

Each dictionary contains:

* role
* content

**Example:**

```python
messages = [
    {
        "role": "system",
        "content": "You are helpful."
    },
    {
        "role": "user",
        "content": "What is AI?"
    }
]
```

---

## 21. What is the difference between List, Tuple, Set, and Dictionary?

| Collection | Ordered | Mutable | Duplicates          |
| ---------- | ------- | ------- | ------------------- |
| List       | Yes     | Yes     | Allowed             |
| Tuple      | Yes     | No      | Allowed             |
| Set        | No      | Yes     | Not Allowed         |
| Dictionary | Yes     | Yes     | Keys Must Be Unique |

---

## 22. Explain how Python Collections are used in a real AI application.

Python Collections are used throughout AI applications to store, organize, and process data.

For example, in a chatbot:

* A **List** stores all conversation messages.
* A **Dictionary** stores each message with keys like `role` and `content`.
* A **Set** can remove duplicate keywords from user input.
* A **Tuple** can store fixed values such as coordinates or configuration settings.

**Example:**

```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant."
    },
    {
        "role": "user",
        "content": "What is AI?"
    }
]

keywords = ["AI", "Python", "AI"]
unique_keywords = set(keywords)

response = {
    "answer": "AI stands for Artificial Intelligence."
}
```

In real AI systems, collections help manage user messages, API responses, datasets, embeddings, and model outputs efficiently.

