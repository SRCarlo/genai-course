# Day 92 — Multi-Agent Systems

## 1. Multi-Agent Systems

Multiple specialized AI agents cooperate to complete a larger task.

## 2. Single Agent vs Multi-Agent

Single agent is simpler.

Multi-agent architecture is useful when responsibilities naturally separate.

## 3. Specialized Agents

Each agent has:

- specific role
- specific tools
- specific permissions
- specific output format

## 4. Agent Contracts

Agents communicate using structured messages.

## 5. Supervisor Agent

The supervisor:

- understands the goal
- delegates work
- collects results
- handles failures
- synthesizes results

## 6. Router Agent

A router determines which agent or workflow should handle a request.

## 7. Planner + Executor

A planner determines tasks and executors perform them.

## 8. Sequential Agents

Dependent tasks execute sequentially.

Example:

Research
↓
Analysis
↓
Writer

## 9. Parallel Agents

Independent tasks can execute simultaneously.

Example:

Node.js Agent
Spring Agent
FastAPI Agent

## 10. Shared State

Agents can use common workflow state.

## 11. Isolated State

Agents should receive only the context they need.

## 12. Context Passing

Only pass relevant information between agents.

## 13. Agent Handoffs

One agent can transfer responsibility to another.

## 14. Agent Permissions

Each agent should have only the permissions required for its role.

## 15. Structured Output

Agent outputs should be structured and validated.

## 16. Reviewer Agent

A reviewer checks the output for:

- missing information
- contradictions
- unsupported conclusions

## 17. Failure Handling

Possible failure strategies:

- retry
- alternative agent
- continue with partial results
- human intervention
- terminate

## 18. Timeout and Retry

Production agents should have timeout and retry mechanisms.

## 19. Loop Protection

Use:

- maxSteps
- maxHandoffs
- maxIterations
- maxLLMCalls
- maxRuntime

## 20. Token Budget

Limit LLM calls and tokens to control cost.

## 21. Observability

Track:

- workflowId
- agentId
- taskId
- startTime
- endTime
- status
- errors
- LLM calls
- handoffs

## 22. Multi-Agent Security

Agent messages should be treated as untrusted input.

Agent-to-agent communication does not replace authorization.

## 23. Project

Multi-Agent Research Assistant

Workflow:

User
↓
Supervisor
↓
Node.js Agent
Spring Boot Agent
FastAPI Agent
↓
Analysis
↓
Reviewer
↓
Writer
↓
Final Result

## 24. Groq

Provider:

Groq

Model:

openai/gpt-oss-20b
