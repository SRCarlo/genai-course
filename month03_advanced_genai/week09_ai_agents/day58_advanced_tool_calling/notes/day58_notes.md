# DAY 58 — Advanced Tool Calling & Multi-Tool Agents

---

## 1. Day 58 Overview

Day 58 upgraded the basic agent architecture from Day 57 into a more reliable and production-oriented multi-tool agent.

The main focus of this day was understanding how an LLM can select tools, generate structured arguments, and interact with backend tools through a controlled execution pipeline.

The system now supports:

- Structured tool schemas
- Tool descriptions
- Tool arguments
- Argument validation
- Tool registry
- Tool lookup
- Tool execution
- Tool errors
- Multiple tools
- Sequential tool execution
- Agent execution limits
- Execution tracing
- Groq LLM integration
- RAG as a potential tool

---

# 2. Day 57 vs Day 58

## Day 57

The basic architecture was:

```text
User
 ↓
LLM
 ↓
Tool
 ↓
Result
 ↓
LLM
 ↓
Final Answer
```

This worked for basic tool calling.

---

## Day 58

The architecture became:

```text
User
 ↓
Agent
 ↓
Groq LLM
 ↓
Tool Selection
 ↓
Tool Registry
 ↓
Argument Validation
 ↓
Tool Executor
 ↓
Tool
 ↓
Tool Result
 ↓
LLM
 ↓
Another Tool / Final Answer
```

This provides better control and reliability.

---

# 3. Main Concept

A tool-calling agent consists of several important components:

```text
Tool Schema
     ↓
Tool Selection
     ↓
Argument Validation
     ↓
Tool Lookup
     ↓
Tool Execution
     ↓
Tool Result
     ↓
LLM Observation
     ↓
Next Action / Final Answer
```

The LLM decides what it wants to do.

The backend decides whether and how that action is allowed to execute.

---

# 4. What Is a Tool?

A tool is a backend capability that an LLM can request.

Examples:

```text
calculator
getCurrentTime
searchKnowledge
weather
database lookup
API request
```

A tool normally has two parts:

```text
Tool
├── Schema
└── Implementation
```

---

# 5. Tool Schema

A tool schema describes what the tool does and what arguments it accepts.

Example:

```javascript
const calculatorSchema = {
  name: "calculator",

  description: "Calculate a basic mathematical expression.",

  parameters: {
    type: "object",

    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression to calculate.",
      },
    },

    required: ["expression"],
  },
};
```

The schema tells the model:

```text
Tool:
calculator

Required argument:
expression

Argument type:
string
```

---

# 6. Why Tool Schemas Matter

Without structured schemas, the backend may receive ambiguous requests.

Example:

```text
calculator 125 * 48
```

With structured tool calling:

```json
{
  "name": "calculator",
  "arguments": {
    "expression": "125 * 48"
  }
}
```

This improves:

- Reliability
- Validation
- Debugging
- Maintainability
- Security
- Provider integration

---

# 7. Tool Schema vs Implementation

These are different concepts.

## Schema

The schema describes the tool.

```text
What can the model request?
What arguments are required?
What types are expected?
```

## Implementation

The implementation actually performs the operation.

```text
What does the backend execute?
```

Architecture:

```text
             TOOL
              │
       ┌──────┴──────┐
       ▼             ▼
    Schema      Implementation
       │             │
       ▼             ▼
      LLM          Node.js
```

---

# 8. Tools Implemented

The Day 58 agent contains three main tools.

## Calculator

```text
calculator
```

Purpose:

```text
Calculate a mathematical expression.
```

Input:

```json
{
  "expression": "25 * 40"
}
```

Expected result:

```text
1000
```

---

## Current Time

```text
getCurrentTime
```

Purpose:

```text
Return the current server time.
```

Input:

```json
{}
```

---

## Knowledge Search

```text
searchKnowledge
```

Purpose:

```text
Search the application's technical knowledge base.
```

Input:

```json
{
  "query": "Express middleware"
}
```

This tool can later be connected to the RAG system built on Day 56.

---

# 9. Tool Registry

A tool registry is a centralized collection of available tools.

Conceptually:

```text
Tool Registry
│
├── calculator
├── getCurrentTime
└── searchKnowledge
```

Instead of writing:

```javascript
if (toolName === "calculator") {
   ...
}

if (toolName === "getCurrentTime") {
   ...
}

if (toolName === "searchKnowledge") {
   ...
}
```

the agent can use:

```text
tool name
   ↓
registry
   ↓
tool
   ↓
execute
```

This becomes much easier to maintain as the number of tools grows.

---

# 10. Tool Lookup

The registry provides a lookup mechanism.

Example:

```javascript
export function getTool(toolName) {
  return tools.find((tool) => tool.schema.name === toolName);
}
```

Then:

```javascript
const tool = getTool("calculator");
```

returns the registered calculator tool.

---

# 11. Argument Validation

LLM-generated arguments cannot automatically be trusted.

For example:

```json
{
  "name": "calculator",
  "arguments": {}
}
```

is invalid because:

```text
expression
```

is required.

The validation pipeline is:

```text
Tool Call
   ↓
Validate
   ↓
Valid?
 ┌─┴─┐
Yes  No
 ↓    ↓
Execute
      Error
```

---

# 12. Required Argument Validation

The validator checks required properties.

Example:

```javascript
if (args[field] === undefined || args[field] === null) {
  return {
    valid: false,
    error: `Missing required argument: ${field}`,
  };
}
```

Example invalid request:

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

# 13. Type Validation

The validator also checks basic types.

For example:

```text
expression → string
query → string
```

Invalid:

```json
{
  "expression": 12345
}
```

Expected:

```text
expression must be a string
```

---

# 14. Tool Execution Pipeline

The complete execution pipeline is:

```text
LLM
 ↓
Tool Call
 ↓
Extract Tool Name
 ↓
Find Tool
 ↓
Validate Arguments
 ↓
Permission Check
 ↓
Execute Tool
 ↓
Capture Result
 ↓
Return Observation
 ↓
LLM
```

This prevents the LLM from directly executing backend operations.

---

# 15. Tool Executor

The tool executor is responsible for coordinating tool execution.

Conceptually:

```javascript
export async function executeToolCall(toolName, argumentsObject) {
  const tool = getTool(toolName);

  if (!tool) {
    return {
      success: false,
      error: `Unknown tool: ${toolName}`,
    };
  }

  const validation = validateToolArguments(tool.schema, argumentsObject);

  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const result = await tool.execute(argumentsObject);

    return {
      success: true,
      tool: toolName,
      result,
    };
  } catch (error) {
    return {
      success: false,
      tool: toolName,
      error: error.message,
    };
  }
}
```

---

# 16. Structured Tool Results

Tool results should be structured.

Instead of:

```text
6000
```

prefer:

```json
{
  "success": true,
  "tool": "calculator",
  "result": {
    "value": 6000
  }
}
```

Failure:

```json
{
  "success": false,
  "tool": "calculator",
  "error": "Invalid expression"
}
```

Structured results make debugging and agent reasoning easier.

---

# 17. Unknown Tool Handling

The LLM may request a tool that does not exist.

Example:

```json
{
  "name": "deleteEverything",
  "arguments": {}
}
```

The registry should fail safely.

Expected:

```json
{
  "success": false,
  "error": "Unknown tool: deleteEverything"
}
```

No operation should be executed.

---

# 18. Sequential Tool Execution

Sequential execution means:

```text
Tool A
 ↓
wait
 ↓
Tool B
 ↓
wait
 ↓
Tool C
```

Example:

```text
Search database
 ↓
Get returned ID
 ↓
Fetch record
```

Tool B depends on Tool A.

Therefore sequential execution is required.

---

# 19. Parallel Tool Execution

Independent tools can potentially execute simultaneously.

Example:

```text
Current time
+
Calculator
+
Knowledge search
```

Conceptually:

```javascript
const results = await Promise.all(
  toolCalls.map((toolCall) =>
    executeToolCall(toolCall.name, toolCall.arguments),
  ),
);
```

Architecture:

```text
             LLM
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
      Time   Calc    RAG
       │      │      │
       └──────┼──────┘
              ▼
           Results
```

Parallel execution can reduce latency.

However, it should only be used when tool calls are independent.

---

# 20. Sequential vs Parallel

## Sequential

Use when:

```text
Tool B depends on Tool A.
```

Example:

```text
Search
 ↓
Get ID
 ↓
Fetch record
```

## Parallel

Use when:

```text
Tool A
Tool B
Tool C
```

are independent.

Example:

```text
Get weather
Calculate value
Get current time
```

---

# 21. Agent Step Limit

Agents must have a maximum number of reasoning/tool steps.

Example:

```javascript
const MAX_AGENT_STEPS = 5;
```

Without a limit, an agent could potentially loop indefinitely.

A step limit protects:

- Cost
- Latency
- Server resources
- External API usage

---

# 22. Tool Call Limit

A single LLM response may potentially request many tools.

Example:

```javascript
const MAX_TOOL_CALLS_PER_STEP = 5;
```

If:

```text
toolCalls.length > 5
```

the backend should reject or limit the operation.

This prevents excessive resource usage.

---

# 23. Agent Execution Trace

The agent should maintain a trace.

Example:

```json
{
  "steps": [
    {
      "step": 1,
      "type": "tool_call",
      "tool": "calculator"
    },
    {
      "step": 2,
      "type": "final"
    }
  ]
}
```

A trace helps answer:

```text
What did the agent do?
Which tool did it select?
What arguments were used?
Did the tool fail?
How many steps were required?
```

---

# 24. Better Trace Information

A production-oriented trace can include:

```json
{
  "step": 1,
  "type": "tool_call",
  "tool": "calculator",
  "arguments": {
    "expression": "125 * 48"
  },
  "success": true,
  "durationMs": 2
}
```

For failures:

```json
{
  "step": 1,
  "type": "tool_call",
  "tool": "calculator",
  "arguments": {
    "expression": "hello"
  },
  "success": false,
  "durationMs": 1,
  "error": "Expression contains unsupported characters"
}
```

---

# 25. Tool Errors as Observations

A tool failure does not always need to crash the agent.

Instead:

```text
Action
 ↓
Tool
 ↓
Error
 ↓
Observation
 ↓
LLM
 ↓
Retry / Alternative / Final Answer
```

Example:

```text
calculator("hello")
```

returns:

```text
Invalid mathematical expression
```

The LLM can then decide how to respond.

---

# 26. Important Debugging Lesson — Calculator

During testing, the calculator tool received:

```text
125 * 48
```

but returned:

```text
Expression contains unsupported characters
```

The agent attempted multiple calls:

```text
Step 1 → "125 * 48"
Step 2 → "125*48"
Step 3 → "125 * 48"
```

All failed.

The final response was:

```text
I was unable to calculate the result
of the mathematical expression.
```

This demonstrates an important production principle:

> A tool should fail safely and return a structured error rather than executing unsafe input.

---

# 27. Calculator Security

Do not implement a calculator using:

```javascript
eval(expression);
```

Never allow arbitrary JavaScript execution from LLM-generated strings.

Unsafe:

```javascript
eval(expression);
```

The LLM controls the expression, so arbitrary code could potentially be executed.

Instead, implement a restricted mathematical parser or use a trusted math expression library with appropriate constraints.

---

# 28. Groq Provider Architecture

This project uses Groq instead of OpenAI.

The architecture should keep provider-specific logic inside:

```text
services/
└── llmService.js
```

The rest of the agent should work with normalized responses.

Conceptually:

```text
Groq API
   ↓
llmService.js
   ↓
Normalized Agent Response
   ↓
Agent
```

Example normalized response:

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

Final response:

```json
{
  "type": "final",
  "content": "The answer is 1000."
}
```

---

# 29. API Key Security

The Groq API key belongs in:

```text
.env
```

Example:

```env
GROQ_API_KEY=your_key_here
```

The `.env` file must not be committed.

`.gitignore` should contain:

```text
.env
node_modules/
```

The API key should never be:

- Hardcoded
- Returned to the frontend
- Sent to the LLM
- Committed to Git
- Logged in traces

---

# 30. Agent Architecture

The final architecture is:

```text
                     USER
                       │
                       ▼
                 Express API
                       │
                       ▼
                     Agent
                       │
                       ▼
                Groq LLM Service
                       │
                       ▼
                      LLM
                       │
                  Tool Calls
                       │
                       ▼
                 Tool Registry
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
          Calculator  Time     RAG
              │        │        │
              └────────┼────────┘
                       ▼
                 Tool Executor
                       │
                 ┌─────┴─────┐
                 ▼           ▼
             Validation   Permissions
                 │
                 ▼
              Execute
                 │
                 ▼
               Result
                 │
                 ▼
                 LLM
                 │
          ┌──────┴──────┐
          ▼             ▼
       Tool Call      Final
                         │
                         ▼
                      Answer
```

---

# 31. Testing Performed

The API was tested through PowerShell.

Example:

```powershell
$response = Invoke-RestMethod `
  -Uri "http://localhost:5000/api/agent/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"Calculate 125 * 48"}'

$response | ConvertTo-Json -Depth 10
```

The API returned:

```json
{
  "success": true,
  "answer": "I was unable to calculate the result of the mathematical expression.",
  "trace": [
    {
      "step": 1,
      "type": "tool_call",
      "tool": "calculator"
    },
    {
      "step": 2,
      "type": "tool_call",
      "tool": "calculator"
    },
    {
      "step": 3,
      "type": "tool_call",
      "tool": "calculator"
    },
    {
      "step": 4,
      "type": "final"
    }
  ]
}
```

The application itself successfully handled the failure without crashing.

---

# 32. Lessons Learned

Day 58 demonstrated that tool calling is more than simply connecting an LLM to a function.

A production tool system needs:

```text
Schema
+
Registry
+
Validation
+
Permissions
+
Execution
+
Error Handling
+
Tracing
+
Limits
```

The LLM should request actions.

The backend should control those actions.

---

# 33. Production Principles

Important principles:

1. Never blindly trust LLM-generated arguments.
2. Validate every tool call.
3. Verify that the requested tool exists.
4. Never use `eval()` for LLM-generated code.
5. Keep secrets in environment variables.
6. Keep provider-specific logic isolated.
7. Limit agent steps.
8. Limit tool calls.
9. Log structured traces.
10. Return structured tool results.
11. Fail safely.
12. Use parallel execution only for independent tools.
13. Keep permissions in the backend.
14. Never expose API keys to the model or client.

---

# 34. Day 58 Final Summary

The progression is:

```text
DAY 57

Basic Agent
   ↓
LLM
   ↓
Tool
   ↓
Result
   ↓
Answer
```

to:

```text
DAY 58

Multi-Tool Agent
       ↓
Tool Schema
       ↓
Tool Registry
       ↓
Validation
       ↓
Permission
       ↓
Tool Executor
       ↓
┌──────┼──────┐
▼      ▼      ▼
Calc  Time    RAG
└──────┼──────┘
       ↓
 Tool Results
       ↓
      LLM
       ↓
Tool / Final
```

---

# 35. Day 58 Completion Status

## Theory

- [x] Tool schema
- [x] Structured arguments
- [x] Tool registry
- [x] Tool validation
- [x] Tool executor
- [x] Tool result
- [x] Sequential tools
- [x] Parallel tools concept
- [x] Agent trace
- [x] Agent limits

## Backend

- [x] Tool schemas
- [x] Registry
- [x] Validator
- [x] Executor
- [x] Multi-tool architecture
- [x] Error handling
- [x] Trace
- [ ] Full RAG integration
- [ ] Production permission layer

## Security

- [x] Validate tool name
- [x] Validate arguments
- [ ] Full tool permission system
- [x] No `eval()`
- [x] No arbitrary code execution
- [x] Maximum steps
- [x] Maximum tool calls
- [x] API keys stored in environment variables

## Testing

- [x] API server startup
- [x] PowerShell API request
- [x] Calculator tool selection
- [x] Tool error handling
- [x] Execution trace
- [ ] Successful calculator result
- [ ] Multiple independent tools
- [ ] Missing arguments
- [ ] Wrong argument types
- [ ] Unknown tool
- [ ] Maximum tool calls

---

# 36. Key Takeaway

The most important lesson from Day 58 is:

```text
The LLM decides what it wants to do.

The backend decides whether it is
allowed to do it and how it is executed.
```

This separation is fundamental to building reliable AI agents.
