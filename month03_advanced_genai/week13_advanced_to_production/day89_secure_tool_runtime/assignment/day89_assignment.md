# Day 89 Assignment

## Project

Secure AI Agent Tool Runtime

## Required Tools

- getOrder
- searchOrders
- refundOrder
- deleteCustomer

## Required Security

- User authorization
- Agent authorization
- Input validation
- Output validation
- Risk policy
- Human approval
- Retry
- Timeout
- Maximum tool calls
- Audit logging

## AI

Provider:

```
Groq AI
```

Model:

```
openai/gpt-oss-20b
```

## Required Tests

### Authorization

10 tests

### Validation

5 tests

### Retry / Timeout

3 tests

### Risk / Approval

3 tests

### Security Attacks

5 tests

## Target

26+ automated tests.

## Security Attacks

1. Unauthorized deleteCustomer
2. Unauthorized refundOrder
3. Unknown tool
4. Malicious orderId object
5. Repeated tool calls

## Final Architecture

```

LLM
↓
Structured Tool Request
↓
Tool Registry
↓
Input Validation
↓
User Authorization
↓
Agent Authorization
↓
Resource Authorization
↓
Risk Policy
↓
Human Approval
↓
Tool Execution
↓
Output Validation
↓
Audit Logging
↓
Tool Result
↓
LLM
↓
Final Answer
```
