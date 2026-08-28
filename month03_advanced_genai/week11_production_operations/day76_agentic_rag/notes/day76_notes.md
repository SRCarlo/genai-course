# DAY 76 — AGENTIC RAG & AI AGENTS

# LLM

```
Input
↓
LLM
↓
Output
```

# RAG

```
Query
↓
Retrieve
↓
LLM
↓
Answer
```

# Agent

```
Goal
↓
Choose action
↓
Tool
↓
Observe
↓
Choose next action
↓
Repeat
↓
Answer
```

# Agentic RAG

```
Agent

- RAG
- Tools
- State
- Guardrails
```

# Model

```
Groq
↓
openai/gpt-oss-20b
```

# Tool Calling

```
LLM
↓
Tool request
↓
Backend validation
↓
Tool execution
↓
Tool result
↓
LLM
```

# Tools

searchKnowledgeBase
calculator
getOrder

# Agent State

query
messages
tool calls
observations
iteration
status
final answer
errors
metrics

# Agent Loop

```
Plan
↓
Act
↓
Observe
↓
Plan
↓
Act
↓
Observe
↓
Finish
```

# ReAct

```
Reason
↓
Act
↓
Observe
```

Do not expose private chain-of-thought.

Use structured action and observation state instead.

# Termination

The agent terminates when:

final answer is ready
maximum iterations are reached
maximum tool calls are reached
execution timeout occurs
fatal error occurs

# Production Limits

max iterations
max tool calls
timeout
cost budget

# Tool Security

Validate:

tool name
arguments
authentication
authorization
permissions
timeout
risk

# Guardrails

```
USER
↓
INPUT GUARD
↓
AGENT
↓
TOOL GUARD
↓
TOOL
↓
AGENT
↓
OUTPUT GUARD
↓
USER
```

# State vs Memory

State:

```
What happened during this task?
```

Memory:

```
What should the system remember across tasks?
```

# Agent Evaluation

Measure:

tool selection accuracy
argument accuracy
task success
final answer quality
number of iterations
latency
tool failures
cost
safety

# Core Principle

An AI agent is not simply an LLM with a tool.

It is a controlled backend system combining:

```
LLM

- State
- Tools
- Decision Logic
- Guardrails
- Observability
- Limits
```

The Day 75 Advanced RAG system becomes one of the tools available to the Day 76 agent.
