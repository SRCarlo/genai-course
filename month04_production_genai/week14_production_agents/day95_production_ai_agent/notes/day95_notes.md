# Day 95 — Production AI Agent Project

## 1. Production AI Agents
A production agent needs controlled execution, security, validation, reliability, evaluation, observability, and maintainable architecture.

## 2. Project Architecture
Client -> REST API -> Agent -> Planner/Memory/Policy -> Tool Executor -> Tools -> Result -> Groq LLM -> Final Answer.

## 3. Agent State
Tracks input, role, session, plan, tool calls, results, errors, status, trace ID, and duration.

## 4. Tool Registry
Only explicitly registered tools can execute.

## 5. Tool Execution
Tool name, arguments, permissions, and business rules are checked before execution.

## 6. Tool Validation
Zod schemas protect the tool boundary.

## 7. Security Policies
Permissions and business rules are enforced in application code.

## 8. Permission Checks
Read tools are available to users; customer updates require an authenticated role.

## 9. Planner
The first implementation uses deterministic routing. This is intentionally easy to test.

## 10. Agent Executor
Planner -> validation -> permission -> business policy -> tool -> LLM response.

## 11. Memory
Short-term in-memory session history is bounded to 20 messages.

## 12. Error Handling
Internal errors are logged while users receive controlled messages.

## 13. Retry Strategy
Only transient failures should be retried.

## 14. API Layer
POST /api/chat exposes the agent.

## 15. Evaluation
Evaluation checks expected tool selection and latency.

## 16. Safety Testing
Unauthorized operations must be denied.

## 17. Regression Testing
Every discovered routing bug becomes a repeatable test.

## 18. Observability
Structured JSONL logs are written to logs/agent.jsonl.

## 19. Tracing
Each request receives a trace ID and spans for planner, tool, and LLM execution.

## 20. Metrics
Requests, tool calls, LLM calls, token counters, failures, and average latency are tracked.

## 21. Cost Monitoring
Groq usage should be tracked from provider usage fields when enabled. This project keeps the metric hooks ready.

## 22. Multi-Agent Architecture
The planner labels requests as research, order, or customer agent domains. These can later be split into independent agents.

## 23. Production Readiness
Security, validation, reliability, evaluation, and observability should be treated as first-class components.

## 24. Testing Strategy
Node's built-in test runner keeps the learning project dependency-light.

## 25. Deployment Considerations
Add real authentication, persistent memory, a database, rate limiting, distributed tracing, secret management, and deployment telemetry before production use.

## 26. Interview Questions & Answers
See assignment/day95_assignment.md.
