# Day 31 — API Integration using Groq API

## Month 2 — LLM Engineering

## Topic: Connecting Applications with Large Language Models

# Section 1 — What is an API?

## Definition

API stands for:

Application Programming Interface

An API allows two different software applications to communicate with each other.

One application sends a request and another application returns a response.

Example:

```
User
 |
 ↓
Frontend Application
 |
 ↓
Backend Server
 |
 ↓
Groq API
 |
 ↓
Llama 3 Model
 |
 ↓
AI Response
 |
 ↓
User
```

---

# Why do we need APIs?

AI models are usually hosted on cloud platforms.

Instead of downloading and running large models locally, developers can send requests through APIs.

Example:

Without API:

```
Download Model
      |
      ↓
Install GPU
      |
      ↓
Manage Infrastructure
      |
      ↓
Run Model
```

With API:

```
Application
      |
      ↓
API Request
      |
      ↓
AI Model
      |
      ↓
Response
```

---

# Section 2 — What is Groq?

## Definition

Groq is an AI inference platform that provides fast access to Large Language Models through APIs.

Groq hosts models such as:

- Llama
- Mixtral
- Gemma
- DeepSeek

Developers can send prompts and receive generated responses.

---

# Why use Groq?

Advantages:

- Fast inference speed
- No GPU required
- Easy API integration
- Simple SDK support
- Suitable for AI applications

---

# Section 3 — API Key

## What is an API Key?

An API key is a secret authentication token used to access an API.

Example:

```
GROQ_API_KEY=gsk_xxxxxxxxx
```

It identifies the application making the request.

---

# Why protect API Keys?

API keys should never be exposed because:

- Anyone can use your account
- Unauthorized usage may happen
- Security risk increases

Never write:

```javascript
const key="gsk_xxxxx";
```

Correct approach:

```
.env
```

Example:

```
GROQ_API_KEY=gsk_xxxxx
```

---

# Section 4 — Environment Variables

Environment variables store configuration values outside application code.

Examples:

- API keys
- Database URLs
- Secret tokens
- Application settings

Node.js example:

```javascript
process.env.GROQ_API_KEY
```

Python example:

```python
os.getenv("GROQ_API_KEY")
```

---

# Section 5 — Python Groq Integration

Install packages:

```
pip install groq python-dotenv
```

Flow:

```
Python Application

↓

Groq SDK

↓

Groq API

↓

LLM Model

↓

Response
```

Example:

```python
from groq import Groq

client = Groq(
api_key="API_KEY"
)

response = client.chat.completions.create()
```

---

# Section 6 — Node.js Groq Integration

Install:

```
npm install groq-sdk dotenv
```

Flow:

```
Node.js Application

↓

Groq SDK

↓

Groq API

↓

Llama Model

↓

Response
```

Example:

```javascript
const groq = new Groq({
apiKey:process.env.GROQ_API_KEY
});
```

---

# Section 7 — Express AI Chat API

Express is used to create backend APIs.

Architecture:

```
Client

↓

Express Server

↓

Groq SDK

↓

Groq API

↓

LLM

↓

Response
```

Example endpoint:

```
POST /chat
```

Request:

```json
{
"message":"Explain AI"
}
```

Response:

```json
{
"reply":"AI is..."
}
```

---

# Section 8 — API Request and Response

## Request

Data sent from client to server.

Example:

```json
{
"message":"What is Python?"
}
```

## Response

Data returned from server.

Example:

```json
{
"reply":"Python is a programming language."
}
```

---

# Section 9 — REST API

REST means Representational State Transfer.

REST APIs use HTTP methods.

| Method | Purpose |
|---|---|
| GET | Fetch data |
| POST | Send data |
| PUT | Update data |
| DELETE | Remove data |

Example:

```
GET /health

POST /chat
```

---

# Section 10 — Error Handling

API calls can fail because of:

- Invalid API key
- Network errors
- Invalid input
- Server problems

Example:

```javascript
try {

}
catch(error){

}
```

Benefits:

- Prevents crashes
- Provides proper responses
- Improves reliability

---

# Section 11 — Conversation History

LLMs do not automatically remember previous messages.

Conversation history is sent manually.

Example:

```javascript
messages:[
{
role:"user",
content:"Hello"
},
{
role:"assistant",
content:"Hi"
}
]
```

This allows the AI to maintain context.

---

# Section 12 — Important Terms

## API

A communication interface between applications.

## Endpoint

A specific URL where an API receives requests.

Example:

```
/chat
```

## SDK

Software Development Kit that simplifies API usage.

## JSON

A data format used for communication.

Example:

```json
{
"name":"AI"
}
```

## Inference

The process where a trained AI model generates output.

## Token

A small unit of text processed by an LLM.

## Middleware

Functions that run between request and response in Express.

---

# Interview Questions and Answers

---

## 1. What is an API?

### Answer:

An API is a software interface that allows two applications to communicate by exchanging requests and responses.

Example:

A backend application uses Groq API to send prompts to an LLM and receive generated answers.

---

## 2. Why are APIs important in AI applications?

### Answer:

APIs allow applications to use powerful AI models without managing model infrastructure.

Benefits:

- No GPU requirement
- Faster development
- Easy integration
- Scalability

---

## 3. What is Groq?

### Answer:

Groq is an AI inference platform that provides API access to open-source Large Language Models.

It allows developers to send prompts and receive model-generated responses.

---

## 4. What is an API Key?

### Answer:

An API key is a secret authentication value used to access an API securely.

It identifies and authorizes the application making requests.

---

## 5. Why use environment variables?

### Answer:

Environment variables keep sensitive information separate from application code.

They protect:

- API keys
- Passwords
- Database credentials

---

## 6. What is an SDK?

### Answer:

SDK stands for Software Development Kit.

It provides ready-made libraries that simplify interaction with APIs.

Example:

Groq SDK allows developers to call LLM models easily.

---

## 7. What is REST API?

### Answer:

REST API is a way of building web services using HTTP methods.

Common methods:

- GET
- POST
- PUT
- DELETE

---

## 8. Why use async/await?

### Answer:

API calls are asynchronous operations.

async/await allows JavaScript applications to wait for API responses without blocking execution.

---

## 9. Difference between local model and hosted model?

### Answer:

Hosted Model:

- Runs on cloud servers
- Accessed through API
- No hardware management

Local Model:

- Runs on personal hardware
- Requires downloading model files
- Requires computing resources

---

## 10. How do you secure API keys?

### Answer:

Best practices:

- Store keys in `.env`
- Add `.env` to `.gitignore`
- Never commit secrets
- Rotate exposed keys

---

## 11. Why is error handling important?

### Answer:

Error handling prevents application crashes and allows developers to return meaningful messages when failures occur.

---

## 12. Why is API integration important for AI Engineers?

### Answer:

Most production AI systems connect applications with LLMs through APIs.

AI engineers need API knowledge to build:

- Chatbots
- AI assistants
- RAG systems
- AI automation tools
- AI-powered applications

---

# Day 31 Final Outcome

After completing Day 31, you can:

- Connect applications with LLM APIs
- Use Groq SDK
- Build AI backend services
- Create REST endpoints
- Secure API credentials
- Handle failures properly
- Build production-style AI applications
