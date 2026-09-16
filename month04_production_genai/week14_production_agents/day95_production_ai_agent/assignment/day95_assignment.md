# Day 95 Assignment — Production AI Support Agent

## Level 1
Build a Node.js AI agent with:
- 3+ tools
- tool validation
- permission checks
- error handling
- basic observability

## Level 2
Add:
- evaluation dataset
- safety dataset
- regression dataset
- trace IDs
- latency metrics
- unit tests

## Level 3 — Capstone
Add:
- multi-agent routing
- tool calling
- memory
- security
- validation
- retry handling
- evaluation
- regression testing
- observability
- metrics
- cost hooks
- API
- tests
- README

## Interview Questions

### Q1. What makes an AI agent production-ready?
A production-ready agent needs controlled tool execution, validation, security, error handling, observability, evaluation, testing, monitoring, and maintainable architecture.

### Q2. Why should tools be controlled by the application?
The model should not have unrestricted access to application capabilities. The application validates tool names, arguments, permissions, and business rules before executing actions.

### Q3. Why is observability important?
Agents perform multiple operations that can fail independently. Tracing and telemetry help identify failures, latency, token usage, and unexpected behavior.

### Q4. Why do production agents need evaluation datasets?
AI behavior can change when prompts, models, tools, or workflows change. Repeatable datasets detect quality and safety regressions.

### Q5. Unit tests vs agent evaluations?
Unit tests verify deterministic application behavior. Agent evaluations measure AI behavior such as tool selection, groundedness, and task success.

### Q6. Why do you need both?
Unit tests protect deterministic logic; evaluations protect probabilistic AI behavior.

### Q7. Why should failures become regression tests?
They represent real failure modes and help prevent reintroduction of the same bug.

### Q8. Why should secrets not be logged?
Logs are often stored and accessed by multiple systems or people. Secrets in logs create avoidable security risk.

### Q9. Why are retries dangerous?
Retries can duplicate side effects. Mutating operations require idempotency and stronger controls.

### Q10. What is a supervisor in a multi-agent system?
A supervisor coordinates specialized agents, routes tasks, controls handoffs, and maintains workflow state.
