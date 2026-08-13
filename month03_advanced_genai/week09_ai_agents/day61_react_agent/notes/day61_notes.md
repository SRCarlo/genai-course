# DAY 61 — ReAct Agent Pattern

## Overview

ReAct stands for:

> Reasoning + Acting

It is an agent pattern where the system repeatedly:

```text
Goal
↓
Decide
↓
Action
↓
Tool
↓
Observation
↓
Decide Again
↓
Action
↓
Observation
↓
Final Answer
```

The key idea is that the agent does not need to know the complete execution sequence upfront.

It decides the next action based on the information currently available.

---

# ReAct

A ReAct agent combines:

- Decision making
- Tool usage
- Observation handling
- State management
- Iterative execution

The basic loop is:

```text
REASON
   ↓
ACTION
   ↓
OBSERVATION
   ↓
REASON
   ↓
ACTION
   ↓
OBSERVATION
```

The loop continues until the agent can produce a final answer.

---

# Normal LLM vs ReAct

## Normal LLM

```text
User
 ↓
LLM
 ↓
Answer
```

A normal LLM may answer directly from its learned knowledge or supplied context.

## ReAct

```text
User
 ↓
Agent
 ↓
Decide
 ↓
Tool
 ↓
Observation
 ↓
Decide
 ↓
Tool
 ↓
Observation
 ↓
Final Answer
```

The ReAct approach is useful when external actions or information are required.

---

# Why ReAct?

Simple tasks can be solved directly.

Example:

```text
25 × 40
```

A calculator or normal computation is sufficient.

More complex tasks may require several operations.

Example:

```text
Search three products,
compare their prices,
calculate the average,
and recommend the cheapest.
```

The agent may need to:

```text
Search Product A
 ↓
Observe
 ↓
Search Product B
 ↓
Observe
 ↓
Search Product C
 ↓
Observe
 ↓
Calculate
 ↓
Compare
 ↓
Answer
```

The next action can depend on previous observations.

---

# ReAct vs Planning

## Planning

Planning generally creates a multi-step plan before execution.

```text
Goal
 ↓
Plan
 ↓
Step 1
 ↓
Step 2
 ↓
Step 3
 ↓
Final
```

Example:

```text
1. Search A
2. Search B
3. Search C
4. Compare
5. Answer
```

## ReAct

ReAct decides the next action at each iteration.

```text
Goal
 ↓
Decide
 ↓
Act
 ↓
Observe
 ↓
Decide
 ↓
Act
 ↓
Observe
 ↓
Final
```

### Key Difference

Planning asks:

> What steps should I perform?

ReAct asks:

> Given what I know now, what should I do next?

---

# ReAct vs Workflow

A workflow is appropriate when the execution path is known.

```text
Input
 ↓
Validate
 ↓
Database
 ↓
Transform
 ↓
Response
```

A ReAct agent is appropriate when the path depends on dynamic information.

```text
Goal
 ↓
Decide
 ↓
Tool
 ↓
Observe
 ↓
Decide
 ↓
Tool
 ↓
Observe
```

Do not use an agent simply because the problem contains multiple steps.

Use an agent when dynamic decision-making provides value.

---

# State

The agent needs state to know what already happened.

Example:

```javascript
{
  goal: "Compare Node.js and Java",

  history: [
    {
      action: "search",
      input: "Node.js"
    },
    {
      action: "search",
      input: "Java"
    }
  ],

  observations: [
    {
      action: "search",
      result: "Node.js..."
    },
    {
      action: "search",
      result: "Java..."
    }
  ],

  iteration: 2,

  status: "running"
}
```

The state contains the agent's working context.

---

# State Fields

A basic ReAct state can contain:

```text
goal
history
observations
currentAction
iteration
maxIterations
status
finalAnswer
```

Additional production fields can include:

```text
toolCalls
startTime
deadline
errors
trace
retryCounts
metadata
```

---

# Action

An action represents what the agent wants to do.

Example:

```json
{
  "type": "tool",
  "tool": "calculator",
  "input": {
    "expression": "25 * 40"
  }
}
```

Another example:

```json
{
  "type": "tool",
  "tool": "search",
  "input": {
    "query": "Node.js latest version"
  }
}
```

A final action can be:

```json
{
  "type": "final",
  "answer": "25 × 40 = 1000."
}
```

---

# Observation

An observation is the result of an action.

Example:

```text
Action:
calculator

Input:
25 * 40

Observation:
1000
```

The agent then receives the observation and decides what to do next.

---

# Core Architecture

```text
USER
 │
 ▼
GOAL
 │
 ▼
REACT AGENT
 │
 ▼
DECIDE
 │
 ▼
ACTION
 │
 ▼
TOOL
 │
 ▼
OBSERVATION
 │
 ▼
UPDATE STATE
 │
 ▼
CONTINUE?
 ├───────────────┐
 │ YES           │ NO
 ▼               ▼
DECIDE          FINAL
```

---

# Deterministic First

The best implementation strategy is:

```text
Step 1
Deterministic loop

Step 2
Add tools

Step 3
Add state

Step 4
Add LLM decision

Step 5
Add memory

Step 6
Add planning

Step 7
Add production guardrails
```

Do not start by combining every component.

If the complete system fails, debugging becomes difficult.

---

# Deterministic Example

Goal:

```text
Calculate 25 × 40
```

First decision:

```json
{
  "type": "tool",
  "tool": "calculator",
  "input": {
    "expression": "25 * 40"
  }
}
```

Observation:

```text
1000
```

Next decision:

```json
{
  "type": "final",
  "answer": "25 × 40 = 1000."
}
```

Execution:

```text
Goal
 ↓
Calculator
 ↓
1000
 ↓
Final
```

---

# LLM Decision

Once the deterministic loop works, replace the decision function with an LLM.

The LLM receives:

```text
Goal
Available Tools
Previous Execution Trace
Observations
```

The LLM should return structured data.

Tool action:

```json
{
  "type": "tool",
  "tool": "search",
  "input": {
    "query": "Node.js"
  }
}
```

Final answer:

```json
{
  "type": "final",
  "answer": "Node.js is a JavaScript runtime..."
}
```

---

# Structured Output

Avoid free-form output such as:

```text
I think I should probably search for Node.js first...
```

Prefer:

```json
{
  "type": "tool",
  "tool": "search",
  "input": {
    "query": "Node.js"
  }
}
```

Structured output allows the backend to:

- Validate the action
- Check the tool
- Validate inputs
- Execute safely
- Record the action
- Handle errors

---

# Tool Registry

Tools should be registered centrally.

Example:

```javascript
const tools = {
  calculator: calculatorTool,
  search: searchTool,
};
```

The registry provides:

```text
getTool(name)
getAvailableTools()
```

The agent should never directly instantiate arbitrary tools.

---

# Tool Authorization

The LLM may request a tool, but requesting a tool does not automatically authorize execution.

The flow should be:

```text
LLM
 ↓
Requested Tool
 ↓
Tool Registry
 ↓
Authorization
 ↓
Input Validation
 ↓
Execute
```

Example:

```javascript
const tool = getTool(action.tool);

if (!tool) {
  throw new Error(`Tool not allowed: ${action.tool}`);
}
```

---

# Tool Execution

The execution layer should be separate from the decision layer.

```javascript
export async function executeAction(action) {
  const tool = getTool(action.tool);

  if (!tool) {
    throw new Error(`Unknown tool: ${action.tool}`);
  }

  return await tool(action.input);
}
```

This separation makes the system easier to test.

---

# Multi-Step Example

Goal:

```text
Calculate the average of 10, 20, 30.
```

First action:

```text
calculator
10 + 20 + 30
```

Observation:

```text
60
```

Second action:

```text
calculator
60 / 3
```

Observation:

```text
20
```

Final:

```text
The average is 20.
```

Architecture:

```text
Goal
 ↓
Calculator
 ↓
Observation: 60
 ↓
Calculator
 ↓
Observation: 20
 ↓
Final
```

---

# Multiple Tools

Example:

```text
Search product price
+
Calculate 18% GST
```

Possible execution:

```text
Search
 ↓
Observation:
Price = ₹1,000
 ↓
Calculator
 ↓
Observation:
GST = ₹180
 ↓
Calculator
 ↓
Observation:
Final Price = ₹1,180
 ↓
Final Answer
```

The important property is that the second action can depend on the first observation.

---

# ReAct + Memory

Memory can provide context before the agent starts deciding.

```text
User
 ↓
Memory
 ↓
ReAct Agent
 ↓
Decision
 ↓
Tool
 ↓
Observation
 ↓
State
 ↓
Next Decision
```

Example:

```text
User preference:
JavaScript
```

The agent can use this information when answering a backend technology recommendation.

---

# ReAct + Planning

Planning and ReAct can be combined.

Planning provides:

```text
High-level strategy
```

ReAct provides:

```text
Dynamic next-action selection
```

Architecture:

```text
                 AGENT
                   │
          ┌────────┴────────┐
          ▼                 ▼
       PLANNER            REACT
          │                 │
          ▼                 ▼
   HIGH-LEVEL PLAN     NEXT ACTION
          │                 │
          └────────┬────────┘
                   ▼
                 TOOLS
```

A planner does not eliminate the need for dynamic execution.

---

# Maximum Iterations

Never use:

```javascript
while (true)
```

Use a maximum iteration limit.

Example:

```javascript
const MAX_ITERATIONS = 10;
```

Then:

```javascript
if (state.iteration >= MAX_ITERATIONS) {
  state.status = "max_iterations_reached";
}
```

Reasons:

- Prevent infinite loops
- Control latency
- Control cost
- Protect infrastructure

---

# Maximum Tool Calls

Track tool usage separately.

Example:

```javascript
state.toolCalls = 0;
```

Maximum:

```javascript
const MAX_TOOL_CALLS = 8;
```

Before execution:

```javascript
if (state.toolCalls >= MAX_TOOL_CALLS) {
  throw new Error("Tool call limit reached");
}
```

An agent can otherwise enter:

```text
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
...
```

---

# Timeout

The agent should also have a maximum execution duration.

Example:

```text
Agent starts
 ↓
Timer starts
 ↓
Agent executes
 ↓
Timeout reached
 ↓
Agent stops
```

A production system may use a deadline rather than relying only on iteration limits.

---

# Tool Errors

Tool execution can fail.

Example:

```text
Agent
 ↓
Search Tool
 ↓
ERROR
```

Do not necessarily crash the entire agent.

Instead record:

```json
{
  "type": "tool_error",
  "tool": "search",
  "error": "Search service unavailable"
}
```

Then allow the agent to decide:

```text
Retry?
Alternative tool?
Continue?
Stop?
```

---

# Retry Handling

Retries should be limited.

Example:

```text
Search
 ↓
Error
 ↓
Retry 1
 ↓
Error
 ↓
Retry 2
 ↓
Stop retrying
```

Do not allow unlimited retries.

Possible retry state:

```javascript
{
  tool: "search",
  attempts: 2
}
```

---

# Execution Trace

An execution trace is a sanitized record of what happened.

Example:

```json
{
  "goal": "Calculate average",
  "iterations": [
    {
      "iteration": 1,
      "tool": "calculator",
      "status": "completed"
    },
    {
      "iteration": 2,
      "tool": "calculator",
      "status": "completed"
    },
    {
      "iteration": 3,
      "type": "final"
    }
  ]
}
```

Execution traces are useful for:

- Debugging
- Monitoring
- Evaluation
- Auditing
- Performance analysis

---

# Chain-of-Thought Safety

Do not expose private chain-of-thought.

Instead expose:

```text
Action
Tool
Status
Duration
Error
Iteration
```

Example:

```json
{
  "iteration": 1,
  "tool": "search",
  "status": "completed"
}
```

This gives developers useful observability without exposing private reasoning.

---

# Production Guardrails

Important guardrails:

- Maximum iterations
- Maximum tool calls
- Timeout
- Tool authorization
- Input validation
- Output validation
- Retry limit
- Rate limiting
- Logging
- Human approval
- Resource limits

---

# Human-in-the-Loop

High-impact actions should require human approval.

Unsafe:

```text
LLM
 ↓
Delete Production Database
 ↓
Execute
```

Safer:

```text
LLM
 ↓
Request Action
 ↓
Validation
 ↓
Human Approval
 ↓
Execute
```

Examples:

- Payments
- Database deletion
- Production deployment
- Sending sensitive email
- File deletion
- External side effects

---

# When NOT to Use an Agent

Do not use ReAct for deterministic operations.

Example:

```text
10 + 20
```

Use deterministic calculation.

Example:

```text
GET /users/:id
```

Use a normal API.

Example:

```text
Validate email
```

Use application validation.

Use ReAct when:

```text
Dynamic task
+
Multiple possible tools
+
Next action depends on observations
```

---

# Research Assistant Example

Goal:

```text
Compare Node.js and Spring Boot
for backend development.
```

Available tools:

```text
search
calculator
```

Possible trace:

```text
Iteration 1
Action: search
Input: Node.js

Observation:
Node.js is a JavaScript runtime.
```

```text
Iteration 2
Action: search
Input: Spring Boot

Observation:
Spring Boot is a Java framework for building applications.
```

```text
Iteration 3
Action: final

Answer:
Comparison between Node.js and Spring Boot...
```

The exact sequence should be chosen dynamically.

---

# Core Principle

The most important Day 61 idea is:

```text
Do not ask:

"What is the complete plan?"

Ask:

"What should I do next
given what I know now?"
```

That is the central idea behind ReAct.

---

# Day 61 Summary

ReAct provides:

```text
Goal
 ↓
Decision
 ↓
Action
 ↓
Observation
 ↓
State Update
 ↓
Decision
 ↓
Action
 ↓
Observation
 ↓
Final
```

The main components are:

- Agent
- State
- Decision
- Action
- Tool
- Observation
- Loop
- Final Answer
- Execution Trace

---

# Production Architecture

```text
                         USER
                           │
                           ▼
                          API
                           │
                           ▼
                    SESSION / MEMORY
                           │
                           ▼
                       REACT AGENT
                           │
                   ┌───────┴────────┐
                   ▼                ▼
                  LLM              STATE
                   │                │
                   ▼                │
                ACTION              │
                   │                │
                   ▼                │
             VALIDATION             │
                   │                │
                   ▼                │
             AUTHORIZATION          │
                   │                │
                   ▼                │
                 TOOL               │
                   │                │
                   ▼                │
              OBSERVATION ──────────┘
                   │
                   ▼
               NEXT LOOP
                   │
          ┌────────┴────────┐
          ▼                 ▼
       CONTINUE            FINAL
                            │
                            ▼
                         RESPONSE
```

---

# Final Principle

A production-quality ReAct agent should be:

```text
Dynamic
+
Structured
+
Observable
+
Bounded
+
Authorized
+
Recoverable
```

The goal is not simply to make an LLM call tools.

The goal is to build a controlled execution loop where every action is validated, every observation updates state, and the agent stops safely when the task is complete.
