# DAY 57 — AI Agents Fundamentals

## What is an AI Agent?

An AI Agent is an LLM-based system that
can decide which actions to take, use
tools, observe results, and continue
toward a goal.

---

## Normal LLM

User
↓
LLM
↓
Answer

---

## RAG

User
↓
Retriever
↓
Context
↓
LLM
↓
Answer

---

## Agent

User
↓
Agent
↓
LLM
↓
Tool
↓
Tool Result
↓
LLM
↓
Final Answer

---

## Agent Components

- Model
- System instructions
- Tools
- Tool schemas
- Tool execution
- State
- Agent loop
- Termination condition

---

## Tool Calling

Tool calling allows the LLM to request
a predefined application function using
structured arguments.

Example:

{
"tool": "calculator",
"arguments": {
"expression": "125 \* 48"
}
}

The Node.js application executes the
function.

---

## Important Principle

The LLM decides which tool may be useful.

The application decides whether the tool
is allowed and executes the tool.

---

## Tool Registry

The application maintains a list of tools.

Example:

calculator
getCurrentTime
searchKnowledge

---

## Agent Loop

1. Receive user request
2. Send request to LLM
3. Check for tool calls
4. Validate tool
5. Parse arguments
6. Execute tool
7. Send result to LLM
8. Repeat
9. Return final answer

---

## Maximum Steps

The agent must have a maximum number
of iterations.

Day 57:

MAX_STEPS = 5

This prevents:

- Infinite loops
- Excessive API calls
- Excessive costs
- Excessive latency

---

## RAG vs Agent

RAG asks:

"What information should I retrieve?"

Agent asks:

"What action should I take next?"

---

## Agent + RAG

Agent
↓
searchKnowledge
↓
RAG
↓
Retrieved Context
↓
Agent
↓
Answer

---

## Security

Never:

- Execute arbitrary model-generated code
- Use unrestricted database access
- Expose secrets
- Trust tool arguments blindly
- Allow unlimited iterations

Always:

- Validate tools
- Validate arguments
- Restrict permissions
- Log safely
- Limit iterations
- Use least privilege

---

## Day 57 Architecture

User
↓
Express API
↓
Agent
↓
Groq LLM
↓
Tool Selection
↓
Tool Execution
↓
Tool Result
↓
Groq LLM
↓
Final Answer
