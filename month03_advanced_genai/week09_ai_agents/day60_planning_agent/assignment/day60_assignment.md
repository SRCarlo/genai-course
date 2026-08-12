# DAY 60 — Planning & Reasoning Agents Assignment

## Objective

Build a Planning AI Agent that can:

1. Understand a complex goal.
2. Break the goal into smaller steps.
3. Create a structured plan.
4. Validate the plan.
5. Execute one step at a time.
6. Use available tools.
7. Observe results.
8. Handle failures.
9. Retry failed operations.
10. Replan when required.
11. Return a final answer.

---

# Task 1 — Plan Schema

Create:

backend/planner/planSchema.js

Implement a structured plan containing:

- goal
- steps
- id
- description
- tool
- status
- result

Expected status values:

- pending
- running
- completed
- failed

---

# Task 2 — Planning State

Create:

backend/state/planningState.js

State should contain:

- goal
- plan
- currentStep
- completedSteps
- failedSteps
- observations
- status

---

# Task 3 — Planner

Create:

backend/planner/planner.js

Implement an initial deterministic planner.

Example:

Goal:

"Calculate the average of 10, 20, 30, 40."

Plan:

1. Calculate the sum.
2. Count the numbers.
3. Divide sum by count.

---

# Task 4 — Plan Validator

Create:

backend/planner/planValidator.js

Validate:

- plan exists
- goal exists
- steps exist
- step ID exists
- description exists

The validator should reject invalid plans.

---

# Task 5 — Calculator Tool

Create:

backend/tools/calculatorTool.js

Connect the calculator implementation from
the previous tool-calling days.

Do not use eval() on arbitrary user or LLM input
in production.

---

# Task 6 — Tool Registry

Create:

backend/tools/toolRegistry.js

Create a registry that maps tool names to tools.

Example:

calculator → calculatorTool

The executor should obtain tools from this registry.

---

# Task 7 — Plan Executor

Create:

backend/executor/planExecutor.js

The executor should:

1. Receive a step.
2. Set status to running.
3. Find the required tool.
4. Execute the tool.
5. Store the result.
6. Set status to completed.
7. Handle failures.

---

# Task 8 — Planning Agent

Create:

backend/agent/planningAgent.js

Implement:

Plan
↓
Execute
↓
Observe
↓
Next Step
↓
Final

The agent should execute one step at a time.

---

# Task 9 — Maximum Step Limit

Implement:

MAX_STEPS

Example:

MAX_STEPS = 10

The agent must stop when the maximum number
of steps is reached.

This prevents infinite loops.

---

# Task 10 — Retry Handling

Implement:

MAX_RETRIES

Example:

MAX_RETRIES = 2

If a temporary tool failure happens,
the agent should retry.

Do not retry indefinitely.

---

# Task 11 — Dynamic Replanning

Implement dynamic replanning.

Example:

Initial plan:

1. Search hotels.
2. Compare prices.
3. Select cheapest.

Observation:

No hotels found.

New plan:

1. Search nearby areas.
2. Compare prices.
3. Select cheapest available hotel.

---

# Task 12 — Tool-Aware Planning

The planner should receive a list of available tools.

Example:

Available tools:

- calculator
- search

The planner must only use tools from the list.

It must not invent tools.

---

# Task 13 — LLM Planner

Replace the deterministic planner with an LLM
planner as an advanced challenge.

The LLM should return structured JSON.

Expected structure:

{
  "goal": "string",
  "steps": [
    {
      "id": 1,
      "description": "string",
      "tool": "string|null",
      "input": {}
    }
  ]
}

The LLM output must be validated before execution.

---

# Task 14 — LLM Provider

If an LLM API is required, use the configured
Groq API instead of OpenAI.

Do not add OpenAI dependency when Groq is being used.

Store the API key in:

.env

Example:

GROQ_API_KEY=your_api_key

Never commit the real API key.

---

# Task 15 — API

Create:

POST /api/agent/run

Request:

{
  "sessionId": "demo-001",
  "goal": "Calculate the average of 10, 20, 30, 40"
}

Response should contain:

- success
- sessionId
- goal
- status
- plan
- observations
- completedSteps
- failedSteps
- result

---

# Task 16 — Thunder Client

Test the API using Thunder Client.

Method:

POST

URL:

http://localhost:5000/api/agent/run

Header:

Content-Type: application/json

Body:

{
  "sessionId": "demo-001",
  "goal": "Calculate the average of 10, 20, 30, 40"
}

The API must return a JSON response.

---

# Task 17 — Execution Logs

Add logs for:

- Plan creation
- Current step
- Tool selection
- Tool result
- Observation
- Retry
- Failure
- Final result

The logs should make the agent execution easy
to understand.

---

# Task 18 — Day 59 Memory Integration

Connect the planning agent with the memory system
created on Day 59.

Architecture:

User
↓
Memory
↓
Goal
↓
Planner
↓
Executor
↓
Tools
↓
Observation
↓
Final Answer

Memory should contain conversational information.

Planning state should contain task execution information.

---

# Task 19 — Day 58 Tool Integration

Connect the tools created during Day 58.

The planning agent should select tools through
the tool registry.

Architecture:

Planner
↓
Tool Name
↓
Tool Registry
↓
Tool
↓
Result

---

# Task 20 — Main Project

Build:

Research Planning Agent

User input:

"Research Node.js, Express.js and Next.js,
compare their backend use cases,
and recommend which one I should learn first."

The agent should create a plan similar to:

1. Research Node.js.
2. Research Express.js.
3. Research Next.js.
4. Compare backend use cases.
5. Generate recommendation.

The main focus is the planning architecture.

---

# Task 21 — Failure Handling

Test these situations:

1. Unknown tool.
2. Invalid plan.
3. Tool failure.
4. Maximum retries reached.
5. Maximum steps reached.
6. Empty goal.
7. Missing required plan fields.

The agent should fail gracefully.

---

# Task 22 — Plan Validation

Test an invalid plan:

{
  "goal": "",
  "steps": []
}

The validator should reject it.

---

# Task 23 — Execution Trace

Verify that the execution trace contains:

- Goal
- Plan
- Step
- Tool
- Result
- Observation
- Status

Example:

PLAN
↓
STEP 1
↓
TOOL
↓
RESULT
↓
OBSERVATION
↓
STEP 2
↓
RESULT
↓
FINAL

---

# Task 24 — Production Guardrails

Implement or document:

- Maximum steps
- Maximum retries
- Maximum tool calls
- Timeout
- Token limit
- Cost limit
- Tool authorization
- Input validation
- Output validation
- Logging

---

# Task 25 — Tests

Create:

tests/planner.test.js

Test:

- Plan creation
- Plan structure
- Plan validation
- Invalid plans

Create:

tests/executor.test.js

Test:

- Successful execution
- Unknown tool
- Failed tool
- Step status

---

# Expected Architecture

User
↓
Memory
↓
Goal
↓
Planner
↓
Plan Validator
↓
Executor
↓
Tool Registry
↓
Tools
↓
Observation
↓
Replanner
↓
Final Answer

---

# Final Checklist

## Theory

- Planning
- Task decomposition
- Planning vs reasoning
- Static planning
- Dynamic planning
- Plan → Execute → Observe
- Replanning
- Retry vs replan
- Execution trace

## Code

- Plan schema
- Plan validator
- Planning state
- Planner
- Tool registry
- Executor
- Planning loop
- Step limit
- Retry limit
- Replanning
- API

## Integration

- Day 58 tools
- Day 59 memory
- Planning state
- Execution trace

## Production

- Plan validation
- Tool authorization
- Step limits
- Retry limits
- Timeouts
- Logging
- Failure handling
- Cost control

## API

- POST /api/agent/run
- Thunder Client testing
- JSON response

## LLM

- Structured planning
- Available tool list
- Plan validation
- Groq API integration when LLM planning is used

## Final Principle

Never blindly execute an LLM-generated plan.

Correct flow:

LLM
↓
Validate
↓
Authorize
↓
Execute
↓
Observe
↓
Replan if required
↓
Final Answer