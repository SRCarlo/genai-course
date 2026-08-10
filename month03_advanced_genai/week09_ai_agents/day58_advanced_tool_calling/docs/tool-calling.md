# Tool Calling Architecture

## 1. Overview

Tool calling allows an LLM to request operations that are implemented by the application backend.

The LLM does not directly execute backend functions.

Instead:

```text
User
 ↓
LLM
 ↓
Tool Call
 ↓
Backend
 ↓
Validation
 ↓
Tool Execution
 ↓
Tool Result
 ↓
LLM
 ↓
Final Response
```

---

# 2. Architecture

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Express    │
                    │     API      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Agent     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Groq Service │
                    └──────┬───────┘
                           │
                           ▼
                         LLM
                           │
                      Tool Call
                           │
                           ▼
                  ┌─────────────────┐
                  │  Tool Registry  │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Calculator       Time          RAG
              │            │            │
              └────────────┼────────────┘
                           ▼
                  ┌─────────────────┐
                  │  Tool Executor  │
                  └────────┬────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                Validation    Permissions
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
              ┌─────┴─────┐
              ▼           ▼
          Tool Call     Final
```

---

# 3. Tool Components

Each tool should have:

```text
Tool
├── Name
├── Description
├── Schema
└── Implementation
```

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
      },
    },
    required: ["expression"],
  },
};
```

---

# 4. Tool Registry

The registry centralizes all available tools.

Example:

```javascript
export const tools = [
  {
    schema: calculatorSchema,
    execute: calculatorTool.execute,
  },

  {
    schema: timeSchema,
    execute: timeTool.execute,
  },

  {
    schema: knowledgeSchema,
    execute: knowledgeTool.execute,
  },
];
```

Tool lookup:

```javascript
export function getTool(toolName) {
  return tools.find((tool) => tool.schema.name === toolName);
}
```

---

# 5. Validation

Before execution:

```text
Tool Name
   ↓
Does Tool Exist?
   ↓
Are Arguments Present?
   ↓
Are Types Correct?
   ↓
Are Permissions Allowed?
   ↓
Execute
```

Invalid calls must never reach the implementation.

---

# 6. Tool Executor

The executor provides one controlled entry point.

```javascript
executeToolCall(toolName, argumentsObject);
```

Responsibilities:

- Tool lookup
- Argument validation
- Permission checks
- Execution
- Error handling
- Result formatting

---

# 7. Result Format

Successful result:

```json
{
  "success": true,
  "tool": "calculator",
  "result": {
    "value": 1000
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

---

# 8. Agent Loop

The agent follows this loop:

```text
for each agent step:

    send messages + tools to LLM

    if LLM returns final:
        return final

    if LLM returns tool calls:

        validate tool call count

        execute tools

        append tool results

        continue
```

Maximum steps must be enforced.

Example:

```javascript
const MAX_AGENT_STEPS = 5;
```

---

# 9. Sequential Execution

Sequential execution:

```javascript
for (const toolCall of toolCalls) {
  const result = await executeToolCall(toolCall.name, toolCall.arguments);
}
```

Use this when tool calls depend on each other.

---

# 10. Parallel Execution

Independent tools can execute concurrently:

```javascript
const results = await Promise.all(
  toolCalls.map((toolCall) =>
    executeToolCall(toolCall.name, toolCall.arguments),
  ),
);
```

Only use this when the calls are independent and safe to execute concurrently.

---

# 11. Agent Trace

Each action should be recorded.

Example:

```json
{
  "step": 1,
  "type": "tool_call",
  "tool": "calculator",
  "arguments": {
    "expression": "25 * 40"
  },
  "success": true
}
```

A final step:

```json
{
  "step": 2,
  "type": "final"
}
```

Tracing supports:

- Debugging
- Observability
- Evaluation
- Performance analysis
- Failure investigation

---

# 12. Error Handling

Tool errors should be converted into structured observations.

Example:

```json
{
  "success": false,
  "tool": "calculator",
  "error": "Expression contains unsupported characters"
}
```

The agent can then decide whether to:

```text
Retry
Use another tool
Ask the user
Return a final answer
```

---

# 13. Security

Tool calling introduces security risks.

The backend must never blindly execute LLM-generated operations.

Required protections:

```text
Tool allowlist
Argument validation
Permission checks
Rate limits
Maximum steps
Maximum tool calls
Timeouts
Error handling
Secret isolation
```

Never use:

```javascript
eval(expression);
```

for arbitrary LLM-generated input.

---

# 14. API Keys

The Groq API key belongs in `.env`.

Example:

```env
GROQ_API_KEY=your_key_here
```

Never commit `.env`.

`.gitignore`:

```text
.env
node_modules/
```

---

# 15. Provider Abstraction

Provider-specific code should remain inside:

```text
services/llmService.js
```

The agent should consume normalized responses.

Example:

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

This reduces coupling between the agent and the LLM provider.

---

# 16. Multi-Tool Example

User:

```text
Give me the current time,
calculate 45 * 78,
and explain Express middleware.
```

Potential tool calls:

```text
getCurrentTime
calculator
searchKnowledge
```

Architecture:

```text
                 Agent
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
       Time       Calc        RAG
        │          │          │
        └──────────┼──────────┘
                   ▼
                 Results
                   │
                   ▼
                   LLM
                   │
                   ▼
              Final Answer
```

---

# 17. Tool Dependencies

Not every tool call can be parallelized.

Example:

```text
searchKnowledge("Express middleware")
        ↓
       result
        ↓
getDocument(result.id)
```

This must be sequential.

Independent calls:

```text
calculator
getCurrentTime
searchKnowledge
```

can potentially run in parallel.

---

# 18. Production Checklist

Before production, verify:

- [ ] Every tool has a schema
- [ ] Every tool is registered
- [ ] Tool names are allowlisted
- [ ] Required arguments are validated
- [ ] Argument types are validated
- [ ] Tool permissions exist
- [ ] Tool execution has error handling
- [ ] Agent step limits exist
- [ ] Tool-call limits exist
- [ ] Tool timeouts exist
- [ ] Tool results are structured
- [ ] Execution tracing exists
- [ ] API keys are protected
- [ ] Arbitrary code execution is disabled
- [ ] Tool calls are tested
- [ ] Failure cases are tested

---

# 19. Core Principle

The LLM is responsible for:

```text
Reasoning
Planning
Tool Selection
Argument Generation
```

The backend is responsible for:

```text
Validation
Authorization
Execution
Secrets
Security
Resource Limits
```

Therefore:

```text
LLM ≠ Backend Authority
```

The model can request an operation.

The backend decides whether the operation is allowed.
