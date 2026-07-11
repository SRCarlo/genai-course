# Day 32 - Structured Output


## What is Structured Output?

Structured Output means asking an AI model to return responses in a fixed, predefined format.

Instead of normal human-readable text, the AI returns machine-readable data.

Common structured formats:

- JSON
- Array
- Markdown Table
- CSV
- XML


---

## Why Structured Output?

Normal AI Output:

```
John is 24 years old and lives in Mumbai.
```

Problem:

- Difficult for software to process.
- Requires manual extraction.
- Not predictable.


Structured Output:

```json
{
    "name":"John",
    "age":24,
    "city":"Mumbai"
}
```

Advantages:

- Easy to parse.
- Easy to validate.
- Works with APIs.
- Works with databases.
- Useful for automation.


---

# Why JSON?


JSON (JavaScript Object Notation) is the most common format used in APIs.


Example:

```json
{
    "name":"John",
    "age":24,
    "city":"Mumbai"
}
```


JSON is used in modern applications:


```
Node.js

↓

Express.js

↓

React

↓

Next.js

↓

Database
```


Benefits:

- Lightweight.
- Human readable.
- Machine readable.
- Supported by all programming languages.


---

# Normal Output vs Structured Output


## Normal Output

```
Python is a programming language created by Guido van Rossum.
```


## Structured Output

```json
{
    "name":"Python",
    "creator":"Guido van Rossum",
    "type":"Programming Language"
}
```


Structured output is easier for applications.


---

# Creating Structured Output Prompt


Example:


```
Explain Python.

Return ONLY valid JSON.

{
"name":"",
"type":"",
"creator":"",
"use_cases":[]
}
```


Important instruction:


```
Return ONLY valid JSON
```


This prevents:

- Extra explanations.
- Markdown formatting.
- Invalid responses.


---

# Project Setup


Create project:

```
mkdir day32_structured_output

cd day32_structured_output
```


Initialize Node:


```
npm init -y
```


Install packages:


```
npm install groq-sdk express dotenv
```


Python:


```
pip install groq python-dotenv
```


---

# Environment Setup


Create:


```
.env
```


Add:


```
GROQ_API_KEY=YOUR_API_KEY
```


---

# Groq Structured Output Flow


```
User

↓

Prompt

↓

Groq LLM

↓

JSON Response

↓

Validation

↓

Application

↓

Database / Frontend
```


---

# Python JSON Parsing


Convert JSON string into Python dictionary:


```python
import json

response = '''
{
"name":"Python",
"type":"Language"
}
'''

data = json.loads(response)

print(data["name"])
```


Output:


```
Python
```


---

# Node.js JSON Parsing


Convert JSON string into JavaScript object:


```javascript
const text = `
{
"name":"Node.js",
"type":"Runtime"
}
`;

const obj = JSON.parse(text);

console.log(obj.name);
```


Output:


```
Node.js
```


---

# Why Validate JSON?


AI responses are not always perfect.

Possible output:


```json
{
"name":"John"
}
```


Problems:

- Missing fields.
- Wrong data types.
- Invalid formatting.


Always validate before using.


---

# Cleaning JSON Response


Sometimes AI returns:


```
```json
{
"name":"John"
}
```
```


Remove markdown:


JavaScript:


```javascript
const clean = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();
```


Then:


```javascript
JSON.parse(clean);
```


---

# Error Handling


## JavaScript


```javascript
try{

const data = JSON.parse(response);

}
catch(error){

console.log("Invalid JSON");

}
```


## Python


```python
try:

data=json.loads(response)

except json.JSONDecodeError:

print("Invalid JSON")
```


---

# Schema Validation


Schema defines the expected structure.


Example:


```json
{
"name":"",
"skills":[],
"experience":"",
"education":[]
}
```


Benefits:

- Predictable output.
- Easier validation.
- Better application integration.


---

# Mini Project: Student Information Extractor


Input:


```
Rahul is 20 years old.

He studies Computer Science.

CGPA is 8.9.
```


Output:


```json
{
"name":"Rahul",
"age":20,
"course":"Computer Science",
"cgpa":8.9
}
```


---

# Assignment: Resume Analyzer


Input:

Resume


Output:


```json
{
"name":"",
"skills":[],
"experience":"",
"education":[],
"strengths":[]
}
```


Bonus:

Save output:

```
resume.json
```


---

---

# Day 32 Interview Questions and Answers


## 1. What is Structured Output?


Structured output is an AI response returned in a predefined machine-readable format such as JSON, XML, CSV, or tables.


It allows software applications to easily process AI responses.


---

## 2. Why is JSON preferred for structured output?


JSON is preferred because:


- Easy to parse.
- Lightweight.
- Supported by almost every programming language.
- Commonly used in APIs.


---

## 3. What is the difference between normal output and structured output?


Normal Output:


```
Rahul scored 90 percent.
```


Structured Output:


```json
{
"name":"Rahul",
"percentage":"90%"
}
```


Structured output is easier for programs to consume.


---

## 4. Why do we use "Return ONLY valid JSON" in prompts?


Because it reduces:

- Extra explanations.
- Markdown blocks.
- Invalid formatting.


It makes parsing easier.


---

## 5. What happens if AI returns invalid JSON?


The parser will fail.


JavaScript:


```
JSON.parse()
```


Python:


```
json.loads()
```


will throw an error.


Applications should use error handling.


---

## 6. What is JSON.parse()?


JSON.parse() is a JavaScript method used to convert JSON strings into JavaScript objects.


Example:


```javascript
const data = JSON.parse(text);
```


---

## 7. What is json.loads()?


json.loads() is a Python function that converts JSON strings into Python dictionaries.


Example:


```python
data=json.loads(text)
```


---

## 8. What is schema validation?


Schema validation checks whether AI output follows the expected structure, fields, and data types.


Example:


Required:


```json
{
"name":"",
"age":0
}
```


---

## 9. Why should we validate AI responses?


Because AI can:

- Miss required fields.
- Generate incorrect formats.
- Return invalid JSON.
- Add unwanted text.


---

## 10. How is structured output used in production?


Examples:


- Resume analyzers.
- Invoice extraction systems.
- Customer support bots.
- Document processing.
- AI automation workflows.


---

## 11. What is the biggest advantage of structured output?


It makes AI responses predictable and allows reliable automation.


---

## 12. Explain structured output production flow.


```
User

↓

LLM

↓

JSON

↓

Validation

↓

Database

↓

Frontend
```


---

## 13. Can AI always generate perfect JSON?


No.

AI may produce malformed JSON, missing fields, or extra text.

Applications must validate output.


---

## 14. How do you remove Markdown JSON blocks?


JavaScript:


```javascript
text
.replace(/```json/g,"")
.replace(/```/g,"")
```


---

## 15. Why is structured output important in AI engineering?


Because it connects AI models with real applications by producing reliable machine-readable responses.


---

# Part 3: Day 32 Cheat Sheet


## JSON Prompt Template


```
Return ONLY valid JSON.

{
"name":"",
"type":"",
"use_cases":[]
}
```


---

## JavaScript JSON Methods


Parse:


```javascript
JSON.parse()
```


Convert:


```javascript
JSON.stringify()
```


---

## Python JSON Methods


Parse:


```python
json.loads()
```


Convert:


```python
json.dumps()
```


---

# Key Concepts


- Structured Output
- JSON
- JSON Schema
- JSON.parse()
- json.loads()
- Validation
- Error Handling
- AI Automation