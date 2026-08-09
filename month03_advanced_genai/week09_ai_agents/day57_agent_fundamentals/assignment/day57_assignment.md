# Day 57 Assignment

## AI Agents Fundamentals

Build and understand a Node.js AI Agent
using the Groq API.

---

## Task 1

Create:

POST /api/agent

Request:

{
"message": "Calculate 125 \* 48"
}

---

## Task 2

Implement three tools:

1. calculator
2. getCurrentTime
3. searchKnowledge

---

## Task 3

Implement a Tool Registry.

The registry should allow the agent
to find a tool by name.

---

## Task 4

Implement the Agent Loop.

Flow:

User
↓
LLM
↓
Tool Call
↓
Tool Execution
↓
Tool Result
↓
LLM
↓
Final Answer

---

## Task 5

Add a maximum of 5 agent steps.

The agent must never run indefinitely.

---

## Task 6

Validate tool names.

Unknown tools must not be executed.

---

## Task 7

Validate tool arguments.

Invalid arguments must return
an error instead of crashing the application.

---

## Task 8

Add tool execution logging.

Log:

- tool name
- arguments
- execution time
- success/failure

Do not log secrets.

---

## Task 9

Connect searchKnowledge to
the Day 56 RAG system.

---

## Task 10

Create at least 10 evaluation questions.

---

## Bonus

Create a fourth tool:

getDocumentation

Then test a multi-step request such as:

"Explain Express middleware and calculate
the number of characters in the answer."

Expected concept:

User
↓
Agent
↓
Knowledge Tool
↓
Result
↓
Agent
↓
Calculator
↓
Result
↓
Agent
↓
Final Answer
