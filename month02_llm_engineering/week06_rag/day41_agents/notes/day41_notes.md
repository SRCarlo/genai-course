# Day 41 - AI Agents (Making AI Take Actions)


---

# 1. Introduction to AI Agents

Until now, we built AI systems that could:

- Chat with users
- Answer questions
- Use RAG for knowledge retrieval
- Remember conversations


AI Agents introduce the ability to:

- Think
- Make decisions
- Select tools
- Call APIs
- Perform actions
- Solve multi-step problems


An AI Agent is a system where an LLM can reason about a task and decide what actions are required to complete it.

---

# 2. Chatbot vs AI Agent

## Traditional Chatbot

Flow:

```
User

↓

Question

↓

LLM

↓

Answer
```


A chatbot mainly generates text responses.

Example:

User:

"What is 25 * 20?"


Chatbot:

Tries to calculate itself.


---

## AI Agent

Flow:

```
User

↓

Question

↓

Reason

↓

Choose Tool

↓

Execute Tool

↓

Observe Result

↓

Final Answer
```


Example:

User:

"What is 25 * 20?"


Agent:

Step 1:

Understand calculation.


Step 2:

Select calculator tool.


Step 3:

Execute calculator.


Step 4:

Return result:

500

---

# 3. Difference Between Chatbot and Agent

| Feature | Chatbot | Agent |
|---|---|---|
| Answer Questions | Yes | Yes |
| Uses Tools | No | Yes |
| Calls APIs | No | Yes |
| Makes Decisions | No | Yes |
| Multi-Step Tasks | No | Yes |
| Performs Actions | No | Yes |
| Planning | No | Yes |
| Memory | Optional | Common |

---

# 4. Agent Mental Model

An Agent consists of:


```
LLM

+

Tools

+

Memory

+

Reasoning

=

AI Agent
```


## LLM

The brain of the system.

Examples:

- GPT
- Claude
- Gemini
- Llama


## Tools

Functions that the agent can call.

Examples:

- Calculator
- Weather API
- Search API
- Database
- Email service
- GitHub API


## Memory

Stores previous conversations and context.


## Reasoning

Allows the agent to decide:

- What should I do?
- Which tool should I use?
- What is the next step?

---

# 5. AI Agent Architecture


```
User

↓

Frontend

↓

Express API

↓

Agent Layer

↓

Reasoning Engine

↓

Tool Selection

↓

Tool Execution

↓

External Services

↓

Final Response
```


---

# 6. ReAct Framework

ReAct means:

Reason + Act


It is one of the most popular agent patterns.


Flow:


```
Thought

↓

Action

↓

Observation

↓

Thought

↓

Action

↓

Observation

↓

Final Answer
```


Example:


Question:

"What is 450 * 23?"


Agent:


Thought:

Need mathematical calculation.


Action:

Call calculator tool.


Observation:

10350


Final Answer:

10350

---

# 7. Tools in AI Agents

Tools are external capabilities given to an LLM.


Example:

Calculator Tool:

```javascript
function calculator(a,b){

return a*b;

}
```


The LLM decides when to call this function.


---

# 8. Types of Tools


## Calculator Tool

Used for:

- Addition
- Multiplication
- Mathematical operations


## Search Tool

Used for:

- Web search
- Information retrieval


## Weather Tool

Used for:

- Current weather
- Forecast


## Database Tool

Used for:

- Reading data
- Updating records


## API Tools

Used for:

- Payments
- Emails
- GitHub
- CRM systems

---

# 9. Agent Workflow


Example:


User:

"Find weather in Mumbai and summarize it"


Agent:


Step 1:

Understand request.


Step 2:

Need weather information.


Step 3:

Call weather API.


Step 4:

Receive weather data.


Step 5:

Generate final response.

---

# 10. LangChain Agents

LangChain provides components for building agents.


Features:

- Agents
- Tools
- Memory
- Executors
- Prompt templates


Architecture:


```
User

↓

Agent

↓

Tool Selection

↓

Tool Execution

↓

Response
```


---

# 11. Agent Executor

Agent Executor manages:

- Planning
- Tool calling
- Result collection
- Final response


Think:


Express Controller

=

Agent Executor


Both manage the execution flow.


---

# 12. Production AI Agent Stack


Frontend:

- Next.js


Backend:

- Express.js


Agent Framework:

- LangChain
- LangGraph


LLM:

- Groq
- OpenAI
- Claude


Memory:

- Redis


Vector Database:

- Qdrant


Monitoring:

- LangSmith


---

# 13. Real World AI Agents


## ChatGPT

Uses:

- Web Search
- Code Interpreter
- File Analysis
- Memory


## Cursor AI

Uses:

- Code Search
- File Reading
- Code Generation


## GitHub Copilot Agent

Uses:

- Repository Access
- Code Search
- Code Modification


---

# 14. Agent Design Patterns


## Pattern 1: Tool Agent


```
Question

↓

Tool

↓

Answer
```


Example:

Calculator


---

## Pattern 2: Planner Agent


```
Goal

↓

Create Plan

↓

Execute Steps

↓

Answer
```


Example:

Travel planning agent


---

## Pattern 3: Multi-Step Agent


```
Question

↓

Research

↓

Analyze

↓

Summarize

↓

Answer
```

---

# Interview Questions and Answers

---

## 1. What is an AI Agent?

Answer:

An AI Agent is a system that uses an LLM to reason, make decisions, use tools, and perform actions to complete tasks.

---

## 2. What is the difference between Chatbot and Agent?

Answer:

A chatbot mainly generates responses based on user input.

An AI Agent can reason, select tools, call APIs, remember context, and complete multi-step tasks.

---

## 3. What is ReAct Framework?

Answer:

ReAct stands for Reason and Act.

It allows an agent to think about a problem, perform actions using tools, observe results, and continue reasoning until completing the task.

---

## 4. What are Tools in AI Agents?

Answer:

Tools are external functions or APIs that an AI Agent can call to perform actions.

Examples:

- Calculator
- Search API
- Weather API
- Database

---

## 5. Why do Agents need Tools?

Answer:

LLMs have limitations.

Tools allow agents to:

- Access real-time information
- Perform calculations
- Modify data
- Interact with external systems

---

## 6. What is Agent Memory?

Answer:

Agent memory stores previous interactions and context so the AI can maintain continuity across conversations.

---

## 7. What is Tool Calling?

Answer:

Tool calling is a capability where an LLM decides to invoke a predefined function or API instead of generating a direct answer.

---

## 8. What is Agent Executor?

Answer:

Agent Executor manages the agent execution process including:

- Planning
- Selecting tools
- Calling tools
- Processing results
- Returning final answers

---

## 9. Name popular Agent Frameworks.

Answer:

Popular frameworks:

- LangChain
- LangGraph
- CrewAI
- AutoGen

---

## 10. What are Agent Design Patterns?

Answer:

Agent design patterns are common architectures used to solve problems using agents.

Examples:

- Tool Agent
- Planner Agent
- Multi-Step Agent

---

## 11. How does an Agent decide which tool to use?

Answer:

The LLM analyzes the user's request, compares available tools, and selects the most suitable tool based on the task requirements.

---

## 12. What is the role of LLM in an Agent?

Answer:

The LLM acts as the reasoning engine that understands requests, makes decisions, selects tools, and generates responses.

---

## 13. Can an Agent work without tools?

Answer:

Yes.

A basic agent can answer questions using only an LLM.

However, tools make agents more powerful by allowing external actions.

---

## 14. What is Multi-Agent System?

Answer:

A multi-agent system contains multiple AI agents working together.

Example:

Research Agent

+

Writer Agent

+

Reviewer Agent

---

## 15. What are limitations of AI Agents?

Answer:

Limitations:

- High complexity
- Higher cost
- Tool errors
- Incorrect decisions
- Security risks
- Requires monitoring

---