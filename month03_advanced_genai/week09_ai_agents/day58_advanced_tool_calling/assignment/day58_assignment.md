# DAY 58 ASSIGNMENT — Advanced Tool Calling

## Objective

Upgrade the Day 57 basic agent into a reliable multi-tool agent.

The agent must support:

```text
calculator
getCurrentTime
searchKnowledge
```

using Groq API.

---

# Task 1 — Tool Schemas

Create schemas for:

- [ ] calculator
- [ ] getCurrentTime
- [ ] searchKnowledge

Each schema must contain:

- [ ] name
- [ ] description
- [ ] parameters
- [ ] property types
- [ ] required arguments

---

# Task 2 — Tool Registry

Create a centralized registry.

Expected architecture:

```text
tools/
├── calculatorTool.js
├── timeTool.js
├── knowledgeTool.js
├── index.js
└── toolRegistry.js
```

Requirements:

- [ ] Register all tools
- [ ] Store schema
- [ ] Store implementation
- [ ] Provide lookup by name

---

# Task 3 — Tool Lookup

Implement:

```javascript
getTool(toolName);
```

Expected behavior:

```text
getTool("calculator")
        ↓
calculator tool
```

Unknown tool:

```text
getTool("unknown")
        ↓
undefined
```

---

# Task 4 — Argument Validation

Implement validation for:

### Required fields

Example:

```json
{
  "name": "calculator",
  "arguments": {}
}
```

Expected:

```text
Missing required argument: expression
```

### Type validation

Example:

```json
{
  "name": "calculator",
  "arguments": {
    "expression": 12345
  }
}
```

Expected:

```text
expression must be a string
```

---

# Task 5 — Tool Executor

Implement:

```javascript
executeToolCall(toolName, argumentsObject);
```

It must:

1. Find the tool.
2. Validate arguments.
3. Execute the tool.
4. Catch errors.
5. Return structured results.

Success:

```json
{
  "success": true,
  "tool": "calculator",
  "result": {}
}
```

Failure:

```json
{
  "success": false,
  "tool": "calculator",
  "error": "..."
}
```

---

# Task 6 — Unknown Tool Protection

Test:

```json
{
  "name": "deleteEverything",
  "arguments": {}
}
```

Expected:

```text
Unknown tool
```

No backend operation should execute.

---

# Task 7 — Multiple Tool Calls

Support requests requiring multiple tools.

Example:

```text
What time is it and what is 50 * 20?
```

Expected tools:

```text
getCurrentTime
calculator
```

Expected calculation:

```text
1000
```

---

# Task 8 — Sequential Execution

Implement sequential execution:

```text
Tool A
 ↓
Result A
 ↓
Tool B
 ↓
Result B
 ↓
LLM
```

Use sequential execution when:

```text
Tool B depends on Tool A.
```

---

# Task 9 — Parallel Execution

Implement a safe parallel execution mode using:

```javascript
Promise.all();
```

Example:

```javascript
const results = await Promise.all(
  toolCalls.map((toolCall) =>
    executeToolCall(toolCall.name, toolCall.arguments),
  ),
);
```

Only use parallel execution for independent tools.

---

# Task 10 — Agent Step Limit

Implement:

```javascript
const MAX_AGENT_STEPS = 5;
```

The agent must stop when the limit is reached.

Expected error:

```text
Maximum agent steps exceeded
```

---

# Task 11 — Tool Call Limit

Implement:

```javascript
const MAX_TOOL_CALLS_PER_STEP = 5;
```

If the LLM returns more than five tool calls in one step, reject the operation.

---

# Task 12 — Agent Trace

Track:

- [ ] step
- [ ] tool
- [ ] arguments
- [ ] success
- [ ] duration
- [ ] error
- [ ] final response

Example:

```json
{
  "step": 1,
  "type": "tool_call",
  "tool": "calculator",
  "arguments": {
    "expression": "25 * 40"
  },
  "success": true,
  "durationMs": 2
}
```

---

# Task 13 — Groq Provider

The project uses Groq API.

The API key must be stored in:

```text
.env
```

Example:

```env
GROQ_API_KEY=your_key_here
```

Do not commit `.env`.

---

# Task 14 — Provider Abstraction

Keep Groq-specific logic inside:

```text
services/llmService.js
```

The agent should consume normalized responses.

Example tool response:

```json
{
  "type": "tool_calls",
  "toolCalls": [
    {
      "name": "calculator",
      "arguments": {
        "expression": "25 * 40"
      }
    }
  ]
}
```

---

# Task 15 — RAG Integration

Connect the Day 56 RAG system through:

```text
searchKnowledge
```

Example:

```text
Explain Express middleware.
```

Expected:

```text
searchKnowledge
```

The RAG system should return useful technical context.

---

# Task 16 — Security

Verify:

- [ ] No `eval()`
- [ ] No arbitrary code execution
- [ ] Tool names are validated
- [ ] Arguments are validated
- [ ] API keys are hidden
- [ ] Tool limits exist
- [ ] Agent limits exist
- [ ] Errors do not crash the server
- [ ] Unknown tools are rejected

---

# Task 17 — Testing

Test the following:

### Test 1 — Calculator

```json
{
  "message": "Calculate 125 * 48"
}
```

Expected:

```text
6000
```

---

### Test 2 — Time

```json
{
  "message": "What time is it?"
}
```

Expected:

```text
getCurrentTime
```

---

### Test 3 — Knowledge

```json
{
  "message": "Explain Express middleware"
}
```

Expected:

```text
searchKnowledge
```

---

### Test 4 — Multiple Tools

```json
{
  "message": "What time is it and what is 50 * 20?"
}
```

Expected:

```text
getCurrentTime
calculator
```

---

### Test 5 — Missing Argument

```json
{
  "name": "calculator",
  "arguments": {}
}
```

Expected:

```text
Missing required argument: expression
```

---

### Test 6 — Unknown Tool

```json
{
  "name": "deleteEverything",
  "arguments": {}
}
```

Expected:

```text
Unknown tool
```

---

### Test 7 — Wrong Type

```json
{
  "name": "calculator",
  "arguments": {
    "expression": 12345
  }
}
```

Expected:

```text
expression must be a string
```

---

### Test 8 — Tool Failure

Force an invalid calculator expression.

Expected:

```json
{
  "success": false,
  "tool": "calculator",
  "error": "..."
}
```

---

# Task 18 — Calculator Debugging

During implementation, verify that valid expressions such as:

```text
125 * 48
```

are accepted.

If the calculator currently returns:

```text
Expression contains unsupported characters
```

investigate the calculator parser.

Do not solve the issue using:

```javascript
eval();
```

The calculator must use a safe expression evaluator/parser.

---

# Task 19 — Evaluation File

Create:

```text
evaluation/tool-tests.json
```

Record:

- test name
- input
- expected tool
- expected result
- status

Example:

```json
{
  "test": "calculator-basic",
  "input": "Calculate 125 * 48",
  "expectedTool": "calculator",
  "expectedResult": 6000,
  "status": "pending"
}
```

---

# Task 20 — Documentation

Create:

```text
notes/day58_notes.md
docs/tool-calling.md
assignment/day58_assignment.md
evaluation/tool-tests.json
```

Documentation should explain:

- [ ] Tool schemas
- [ ] Tool registry
- [ ] Validation
- [ ] Tool execution
- [ ] Sequential execution
- [ ] Parallel execution
- [ ] Agent limits
- [ ] Trace
- [ ] Security
- [ ] Groq integration
- [ ] Testing

---

# Bonus Challenge

Create:

```text
weatherTool.js
```

The agent should support:

```text
calculator
getCurrentTime
searchKnowledge
weather
```

Example:

```text
What is the weather in Mumbai?
```

Expected:

```text
weather
```

---

# Advanced Challenge

Create a request requiring three independent tools:

```text
Give me the current time,
calculate 45 * 78,
and explain Express middleware.
```

Expected:

```text
getCurrentTime
calculator
searchKnowledge
```

Expected calculation:

```text
3510
```

The independent tools may be executed in parallel.

---

# Completion Checklist

## Theory

- [ ] Tool schema
- [ ] Structured arguments
- [ ] Tool registry
- [ ] Argument validation
- [ ] Tool executor
- [ ] Tool result
- [ ] Sequential execution
- [ ] Parallel execution
- [ ] Agent trace
- [ ] Agent limits

## Backend

- [ ] Calculator
- [ ] Current time
- [ ] Knowledge search
- [ ] Registry
- [ ] Validator
- [ ] Executor
- [ ] Multi-tool agent
- [ ] Error handling
- [ ] Groq integration
- [ ] RAG integration

## Security

- [ ] No eval
- [ ] Argument validation
- [ ] Tool allowlist
- [ ] Permission layer
- [ ] API key protection
- [ ] Maximum agent steps
- [ ] Maximum tool calls

## Testing

- [ ] Calculator
- [ ] Time
- [ ] Knowledge search
- [ ] Multiple tools
- [ ] Missing arguments
- [ ] Wrong types
- [ ] Unknown tool
- [ ] Tool failure
- [ ] Agent step limit
- [ ] Tool call limit

## Documentation

- [ ] day58_notes.md
- [ ] tool-calling.md
- [ ] day58_assignment.md
- [ ] tool-tests.json

---

# Final Deliverable

The final Day 58 agent should provide:

```text
User
 ↓
Express API
 ↓
Agent
 ↓
Groq
 ↓
Tool Selection
 ↓
Tool Registry
 ↓
Validation
 ↓
Execution
 ↓
Tool Result
 ↓
LLM
 ↓
Final Answer
```

The backend must remain in control of every tool execution.
