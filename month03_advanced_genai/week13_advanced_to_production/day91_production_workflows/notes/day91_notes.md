# Day 91 — Production Agent Workflows

## Core idea

Use deterministic workflows for reliable orchestration and agent steps for flexible reasoning.

## Architecture

```
Next.js/UI → Express API → Job → Worker → Workflow Runner → Deterministic/Agent Steps → Tools → State → Checkpoint → Next Step.
```

## Important concepts

1. Workflow vs agent
2. Hybrid agentic workflows
3. Workflow state
4. Step state
5. Checkpointing
6. Resumability
7. Human-in-the-loop
8. Approval workflows
9. Background jobs
10. Retry with exponential backoff
11. Jitter
12. Idempotency
13. At-least-once execution
14. Compensation/Saga
15. Event-driven execution
16. Cancellation
17. Timeouts
18. Optimistic concurrency
19. Audit trail
20. Failure recovery

## Project

The project implements a customer refund workflow.

Normal order:
get order → agent decision → policy → refund → notification.

High-value order:
get order → agent decision → policy → approval → refund → notification.

The LLM is only used for the decision step. Critical side effects remain controlled by deterministic code and policy.

## Groq

The agent uses Groq with `openai/gpt-oss-20b`.

Environment variables:

- `GROQ_API_KEY`
- `GROQ_MODEL`

Never commit `.env`.
