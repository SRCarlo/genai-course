# Day 42 – Tool Calling (The Heart of Modern AI Agents)

---

# What is Tool Calling?

Tool Calling is a capability that allows a Large Language Model (LLM) to invoke external functions, APIs, databases, or services to complete tasks that it cannot reliably perform on its own.

Instead of only generating text, the LLM can decide to use a tool, execute it, receive the result, and then generate the final response.

---

# Why Tool Calling?

LLMs are excellent at:

- Natural Language Understanding
- Text Generation
- Reasoning
- Summarization
- Translation

However, they are limited when it comes to:

- Real-time information
- Mathematical calculations
- Database operations
- Calling APIs
- File operations
- Running code

Tool Calling solves these limitations.

---

# Without Tool Calling

```
User
   │
   ▼
LLM
   │
   ▼
Answer
```

Example

User:

```
What is 245 × 89?
```

The LLM estimates the answer from its learned patterns.

---

# With Tool Calling

```
User
   │
   ▼
LLM
   │
Choose Tool
   │
   ▼
Calculator Tool
   │
Returns Result
   │
   ▼
LLM
   │
   ▼
Final Answer
```

Example

```
User:
What is 245 × 89?

↓

LLM selects Calculator Tool

↓

Calculator returns 21805

↓

LLM replies:
The answer is 21805.
```

---

# Why Modern AI Uses Tools

Modern AI assistants need access to external systems.

Examples include:

- Weather APIs
- Google Search
- GitHub
- Databases
- Email
- Calendar
- File System
- Payment APIs

Without tools, the model cannot perform these actions.

---

# Real-World Examples

## ChatGPT

Uses tools like:

- Web Search
- Code Interpreter
- File Analysis
- Image Generation

---

## GitHub Copilot

Uses:

- Repository Search
- Code Analysis
- Pull Request Review

---

## Cursor AI

Uses:

- Read File
- Write File
- Terminal Commands
- Search Codebase

---

## Perplexity AI

Uses:

- Web Search
- Citation Retrieval

---

# Tool Calling Workflow

```
User Question
      │
      ▼
LLM
      │
Analyze Intent
      │
      ▼
Choose Tool
      │
      ▼
Execute Tool
      │
      ▼
Receive Result
      │
      ▼
Generate Final Response
```

---

# Tool Calling Components

## 1. Tool

A function or API that performs a specific task.

Example:

- Calculator
- Weather
- GitHub
- Search

---

## 2. Tool Schema

A schema describes:

- Tool Name
- Description
- Parameters

Example

```json
{
  "name": "calculator",
  "description": "Perform mathematical calculations",
  "parameters": {
    "operation": "multiply",
    "a": 20,
    "b": 30
  }
}
```

---

## 3. Tool Registry

A Tool Registry is a centralized collection of available tools.

Example

```
Calculator

Weather

GitHub

Database

Search
```

The LLM checks the registry before choosing a tool.

---

# Function Calling

Function Calling is a mechanism where an LLM returns structured instructions describing which function should be executed and with what parameters.

Example

```json
{
  "tool": "calculator",
  "arguments": {
    "operation": "multiply",
    "a": 40,
    "b": 50
  }
}
```

The backend executes the function and sends the result back to the model.

---

# Tool Execution Flow

```
Question

↓

LLM

↓

Function Call

↓

Backend

↓

Tool

↓

Result

↓

LLM

↓

Final Response
```

---

# Example

Question

```
What is 75 × 60?
```

Tool Selected

```
Calculator
```

Arguments

```json
{
  "operation": "multiply",
  "a": 75,
  "b": 60
}
```

Tool Output

```
4500
```

Final Answer

```
The answer is 4500.
```

---

# Production Architecture

```
Frontend

↓

Express API

↓

Agent

↓

Tool Registry

↓

External APIs

↓

LLM

↓

Response
```

---

# Common AI Tools

- Calculator
- Weather API
- GitHub API
- Google Search
- Database
- File Reader
- Email
- Calendar

---

# Difference Between RAG and Tool Calling

| RAG                  | Tool Calling           |
| -------------------- | ---------------------- |
| Retrieves knowledge  | Performs actions       |
| Reads documents      | Executes functions     |
| Uses vector database | Uses APIs              |
| Returns information  | Returns action results |

---

# Advantages of Tool Calling

- Accurate calculations
- Real-time information
- API integration
- Database access
- Better automation
- More capable AI agents

---

# Limitations

- Requires backend implementation
- API failures must be handled
- Network latency
- Authentication may be required

---

# Popular Frameworks Supporting Tool Calling

- LangChain
- LangGraph
- OpenAI SDK
- Groq SDK
- Anthropic SDK
- Vercel AI SDK

---

# Interview Questions and Answers

## 1. What is Tool Calling?

**Answer:**

Tool Calling is the process where an LLM selects and invokes external functions or APIs to perform tasks such as calculations, API requests, database queries, or file operations.

---

## 2. Why is Tool Calling important?

**Answer:**

Tool Calling enables AI models to perform actions beyond text generation, including accessing real-time information, executing code, and interacting with external systems.

---

## 3. What is Function Calling?

**Answer:**

Function Calling is a feature where an LLM generates structured data specifying which function should be executed and what arguments should be passed.

---

## 4. What is a Tool Schema?

**Answer:**

A Tool Schema describes a tool, including its name, purpose, parameters, and expected inputs, allowing the LLM to understand how to use it.

---

## 5. What is a Tool Registry?

**Answer:**

A Tool Registry is a centralized list of all available tools that an AI agent can access and use.

---

## 6. How does Tool Calling work?

**Answer:**

1. User asks a question.
2. LLM analyzes the request.
3. LLM selects the appropriate tool.
4. Backend executes the tool.
5. Tool returns the result.
6. LLM generates the final response.

---

## 7. What are examples of AI tools?

**Answer:**

- Calculator
- Weather API
- Search Engine
- GitHub API
- Database
- File Reader
- Email Service
- Calendar

---

## 8. What is the difference between Tool Calling and Function Calling?

**Answer:**

Function Calling is the mechanism used by the model to request a function execution, while Tool Calling is the overall process of selecting, executing, and using external tools.

---

## 9. Can an AI agent use multiple tools?

**Answer:**

Yes. An AI agent can invoke multiple tools in sequence or parallel depending on the task.

---

## 10. What is the role of the backend in Tool Calling?

**Answer:**

The backend receives the function call from the LLM, executes the requested tool or API, and returns the result to the model.

---

## 11. What happens if a tool fails?

**Answer:**

The backend should handle errors gracefully and return an appropriate error message or fallback response to the LLM.

---

## 12. What is the difference between RAG and Tool Calling?

**Answer:**

RAG retrieves information from external knowledge sources, while Tool Calling executes actions using external functions or APIs.

---

## 13. Which frameworks support Tool Calling?

**Answer:**

- LangChain
- LangGraph
- OpenAI SDK
- Groq SDK
- Anthropic SDK
- Vercel AI SDK

---

## 14. What are common use cases for Tool Calling?

**Answer:**

- Mathematical calculations
- Weather information
- Database queries
- Web search
- File reading
- Email automation
- Calendar scheduling
- GitHub repository management

---

## 15. What powers ChatGPT Tools?

**Answer:**

ChatGPT Tools are powered by Tool Calling combined with Function Calling, allowing the model to invoke external capabilities such as web search, file analysis, and code execution.

---

# Key Takeaways

- Tool Calling extends LLM capabilities.
- Function Calling provides structured tool requests.
- Tool Schemas describe available tools.
- Tool Registries organize all tools.
- AI agents choose tools based on user intent.
- Backend services execute tools and return results.
- Modern AI assistants rely heavily on Tool Calling for real-world tasks.
