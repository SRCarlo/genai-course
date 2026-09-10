# Day 89 — Secure AI Agent Tool Calling

## 1. What is Tool Calling?

Tool calling allows an LLM to request an application-defined capability.

The LLM does not directly execute the tool.

The application validates and authorizes the request.

## 2. Function Calling

Function calling allows the model to produce structured arguments for an application function.

## 3. Tool Registry

A controlled mapping between approved tool names and implementations.

## 4. Tool Schema

Every tool should define:

- name
- description
- input schema
- output schema
- permission
- risk level
- execution function

## 5. Input Validation

LLM-generated arguments are untrusted.

Zod validates tool arguments before execution.

## 6. Output Validation

Tool results are also validated before being returned to the LLM.

## 7. Tool Gateway

The security boundary between the AI agent and application tools.

## 8. Authorization

Both user and agent permissions must be checked.

## 9. Risk Policies

Different tools have different security risks.

LOW:
normal read operations.

HIGH:
financial or important actions.

CRITICAL:
destructive operations.

## 10. Human Approval

High-risk operations can require human approval.

## 11. Tool Retry

Temporary failures can be retried using exponential backoff.

## 12. Tool Timeout

Tools must not run indefinitely.

## 13. Parallel Tool Calls

Independent read operations can potentially run concurrently.

## 14. Sequential Tool Calls

Dependent operations must respect execution order.

## 15. Agent Execution Loop

The LLM can request tools repeatedly until it produces a final answer.

## 16. Maximum Tool Calls

A maximum prevents infinite loops, excessive cost and resource exhaustion.

## 17. Audit Logging

Every tool execution should be auditable.

Never unnecessarily log secrets.

## 18. Security Threats

Important threats include:

- hallucinated tool names
- invalid arguments
- unauthorized tools
- prompt injection through tool results
- excessive tool calls
- dangerous high-risk actions
- malformed tool output

## 19. Production Architecture

```
User
↓
API
↓
Agent
↓
LLM
↓
Tool Request
↓
Tool Gateway
↓
Validation
↓
Authorization
↓
Risk Policy
↓
Human Approval
↓
Tool
↓
Result Validation
↓
Audit
↓
LLM
↓
Final Answer
```

## 20. Interview Questions & Answers

### What is function calling?

Function calling allows an LLM to produce a structured request to invoke an application-defined function or tool.

The application must validate and authorize the request before execution.

### Should an LLM directly execute tools?

No.

The LLM should request a tool call.

The application controls execution.

### Why validate tool arguments?

Because LLM-generated arguments are untrusted.

### Why validate tool output?

External services can return malformed or unexpected data.

### What is a tool registry?

A controlled mapping between approved tool names and implementations.

### What is a tool gateway?

A security and execution boundary between an AI agent and application tools.

### Why limit tool calls?

To prevent infinite loops, API abuse, unexpected cost and resource exhaustion.

### When should tools execute in parallel?

When the operations are independent.

### When should tools execute sequentially?

When one operation depends on another.

### How do you secure high-risk tools?

Use:

Authentication

- Authorization
- Validation
- Resource authorization
- Risk policy
- Human approval
- Audit logging

### What is human-in-the-loop?

A human must approve certain AI-generated actions before execution.

### Core Principle

The LLM decides what it wants to do.

The Tool Gateway decides what it is allowed to do.

The application executes it safely.
