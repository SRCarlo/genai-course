# Day 90 — AI Agent Execution Runtime Notes

## 1. Objective

Day 90 focuses on building a production-style, multi-step AI agent runtime.

The runtime follows this high-level lifecycle:

```text
User Goal
   ↓
Planner
   ↓
Validated Plan
   ↓
Dependency Graph
   ↓
Executor
   ↓
Tool Gateway
   ↓
Observation
   ↓
State Update
   ↓
Replanning / Recovery
   ↓
Termination
```

The implementation uses Groq AI with the model:

```text
openai/gpt-oss-20b
```

The AI is used for planning. Tool execution remains controlled by the application runtime.

---

## 2. Core Architecture

### Planner

The planner converts a natural-language goal into structured execution steps.

Example:

```text
Check order 12345 and refund it if eligible.
```

Possible plan:

```text
1. getOrder
2. checkRefundEligibility
3. refundOrder
```

The plan is validated before execution.

### State

The agent state stores:

- Goal
- Current plan
- Current step
- Observations
- Tool calls
- Errors
- Result
- Iteration count
- Budget information
- Approval information
- Request metadata

Typical states:

```text
pending
planning
executing
observing
recovering
completed
failed
terminated
waiting_for_approval
```

---

## 3. Planning

The project uses Zod to validate the planner output.

Each step contains information such as:

```text
id
tool
args
status
dependsOn
```

Example:

```json
{
  "id": "step-2",
  "tool": "checkRefundEligibility",
  "args": {
    "orderId": "12345"
  },
  "status": "pending",
  "dependsOn": ["step-1"]
}
```

This prevents the model from directly controlling arbitrary application behavior.

---

## 4. Dependency Graph

Steps can depend on previous steps.

Example:

```text
getOrder
   ↓
checkRefundEligibility
   ↓
refundOrder
```

A step becomes ready only when its dependencies are completed.

This provides deterministic execution order even when the plan contains multiple steps.

---

## 5. Execution

The executor:

1. Checks the execution budget.
2. Checks authorization.
3. Applies the risk policy.
4. Checks whether human approval is required.
5. Executes the selected tool.
6. Applies timeout handling.
7. Applies retry handling.
8. Records the observation.
9. Updates the agent state.

The model does not directly execute application functions.

---

## 6. Tool Registry

Available tools:

```text
getOrder
checkRefundEligibility
refundOrder
```

The registry provides a controlled boundary between the agent and application capabilities.

Only registered and authorized tools can execute.

---

## 7. Authorization

Authorization prevents unknown tools from being executed.

Allowed tools are explicitly defined.

This is important because an AI-generated plan should never be treated as trusted executable code.

---

## 8. Risk Policy

Not every tool has the same risk.

Example:

```text
getOrder                  → low risk
checkRefundEligibility   → low risk
refundOrder              → high risk
```

High-risk actions require human approval unless demo auto-approval is enabled.

---

## 9. Human Approval

When the agent reaches:

```text
refundOrder
```

the runtime can pause with:

```text
waiting_for_approval
```

An approval ID is generated automatically:

```text
approval-<uuid>
```

Example:

```text
approval-7f8c2a91-4c3b-4e2d-a1b8-91c8d1234567
```

The ID is returned by:

```text
POST /agent/run
```

The approval endpoints use that exact ID:

```text
GET  /approvals/:approvalId
POST /approvals/:approvalId/approve
POST /approvals/:approvalId/reject
```

### Important

For a production system, approval records should be persisted in a database rather than an in-memory Map.

The demo implementation uses in-memory storage for simplicity.

---

## 10. Idempotency

Refund execution uses an idempotency key.

Conceptually:

```text
same operation + same idempotency key
                    ↓
              same result
```

This helps prevent duplicate refunds when retries or repeated requests occur.

For production, idempotency records should be stored in durable storage.

---

## 11. Retry Strategy

Retryable failures include:

```text
TIMEOUT
RATE_LIMIT
SERVICE_UNAVAILABLE
NETWORK_ERROR
```

The runtime retries temporary failures instead of immediately failing the entire task.

Permanent errors should not be blindly retried.

---

## 12. Timeout

Each tool execution is protected by a timeout.

If execution exceeds the configured limit:

```text
TIMEOUT
```

is raised and the retry layer can decide whether another attempt is appropriate.

---

## 13. Budget Controls

The runtime limits:

```text
MAX_ITERATIONS
MAX_TOOL_CALLS
MAX_EXECUTION_TIME_MS
MAX_COST
```

Budget controls protect the application from:

- Infinite loops
- Excessive tool calls
- Long-running tasks
- Unexpected AI execution cost

---

## 14. Recovery

If a step fails, the agent can enter:

```text
recovering
```

The runtime can record the error and decide whether execution should retry, replan, or terminate.

Recovery should be deterministic and observable.

---

## 15. Observability

The tracer records important runtime events.

Example:

```text
[TRACE] agent.start
[TRACE] planning.start
[TRACE] planning.complete
[TRACE] execution.start
[TRACE] tool.call
[TRACE] tool.result
[TRACE] approval.required
[TRACE] agent.completed
```

In production, these events should normally be sent to a structured logging or tracing system.

---

## 16. Groq Integration

The project uses the official Groq JavaScript SDK:

```text
groq-sdk
```

Environment variables:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

The planner sends the goal to Groq and requests a structured JSON plan.

Important security principle:

```text
AI decides WHAT should happen.
Application decides WHAT is allowed to happen.
```

The AI should not receive unrestricted access to application internals.

---

## 17. API Endpoints

### Health

```http
GET /health
```

### Run Agent

```http
POST /agent/run
Content-Type: application/json
```

Example:

```json
{
  "goal": "Check my order 12345 and refund it if eligible."
}
```

### Get Approval

```http
GET /approvals/:approvalId
```

### Approve

```http
POST /approvals/:approvalId/approve
```

### Reject

```http
POST /approvals/:approvalId/reject
```

---

## 18. Example Runtime Flow

```text
POST /agent/run
       ↓
Agent receives goal
       ↓
Groq creates plan
       ↓
Plan validation
       ↓
getOrder
       ↓
checkRefundEligibility
       ↓
refundOrder
       ↓
Risk policy detects high-risk action
       ↓
Human approval required
       ↓
waiting_for_approval
```

After approval:

```text
POST /approvals/:approvalId/approve
       ↓
Approval accepted
       ↓
Agent resumes
       ↓
refundOrder
       ↓
Observation recorded
       ↓
Agent completed
```

---

## 19. Environment Configuration

Example:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b

MAX_ITERATIONS=10
MAX_TOOL_CALLS=20
MAX_EXECUTION_TIME_MS=60000
MAX_COST=1

AUTO_APPROVE_DEMO=false
```

Never commit the real `.env` file or API key to GitHub.

---

## 20. Testing Checklist

The project should test:

- State creation
- Planner validation
- Dependency resolution
- Tool execution
- Retry behavior
- Timeout behavior
- Budget limits
- Termination conditions
- Authorization
- Risk policy
- Human approval
- Idempotency
- Recovery

Run:

```bash
npm test
```

---

## 21. Important Production Improvements

The Day 90 implementation is intentionally educational but follows production-style concepts.

For a real production deployment, improve it with:

1. PostgreSQL or another durable database.
2. Redis for distributed state and locks.
3. A queue such as BullMQ for long-running jobs.
4. Persistent approval records.
5. Distributed idempotency keys.
6. Structured JSON logging.
7. OpenTelemetry tracing.
8. Authentication and RBAC.
9. Rate limiting.
10. Secret management.
11. Stronger tool schemas.
12. Audit logs.
13. Persistent agent state.
14. Worker-based execution.
15. Better cost tracking.
16. Dead-letter queues for failed jobs.

---

## 22. Key Learning

The main lesson of Day 90 is that an AI agent should not simply be:

```text
LLM → tool → result
```

A safer architecture is:

```text
Goal
 ↓
Plan
 ↓
Validate
 ↓
Authorize
 ↓
Risk Check
 ↓
Approval if required
 ↓
Execute
 ↓
Observe
 ↓
Update State
 ↓
Recover / Replan
 ↓
Terminate
```

This creates a controlled agent runtime instead of an unrestricted AI tool caller.

---

## 23. Final Interview Explanation

A concise explanation:

> "I built a production-style multi-step AI agent runtime using Groq's GPT-OSS 20B model. The model is responsible for generating a structured plan, while the application runtime validates the plan, checks dependencies, authorizes tools, applies risk policies, handles human approval, executes tools with retries and timeouts, records observations, enforces budgets, and controls termination. High-risk operations such as refunds require human approval, and idempotency prevents duplicate execution."
