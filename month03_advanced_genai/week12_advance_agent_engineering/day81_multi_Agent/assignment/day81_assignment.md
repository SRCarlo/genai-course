# 41. Assignment

```markdown
# DAY 81 ASSIGNMENT

## Basic

- [x] Implement handoff contract
- [x] Implement message types
- [x] Implement agent result schema
- [x] Implement shared workflow state
- [x] Implement sequential workflow
- [x] Implement router

## Intermediate

- [x] Add conditional routing
- [x] Add retry
- [x] Add exponential backoff
- [x] Add jitter
- [x] Add timeout
- [x] Add fallback agent
- [x] Add maximum steps
- [x] Add review feedback loop

## Advanced

- [x] Add parallel agents
- [x] Add aggregator agent
- [x] Add Zod validation
- [x] Add execution history
- [x] Add agent permissions
- [x] Add human approval
- [x] Add structured logging
- [x] Add token tracking

## Main Project

Build:

Multi-Agent Developer Assistant v2

Input:

Research Redis caching, implement a Node.js caching layer,
and review the implementation.

Workflow:

User
↓
Supervisor
↓
Researcher
↓
Handoff
↓
Coder
↓
Handoff
↓
Reviewer
↓
Approved?
├── Yes → Final
│
└── No → Coder → Reviewer

Limits:

MAX_STEPS = 10

MAX_REVIEW_ATTEMPTS = 3

MAX_RETRY_ATTEMPTS = 3

TIMEOUT = 30 seconds

## Model

Provider:

Groq

Model:

openai/gpt-oss-20b

## Production Requirements

The system must:

- validate agent results
- limit workflow iterations
- retry transient failures
- use exponential backoff
- timeout long-running agents
- support fallback agents
- record execution history
- track token usage
- enforce agent permissions
- support human approval
- support parallel workflows
```
