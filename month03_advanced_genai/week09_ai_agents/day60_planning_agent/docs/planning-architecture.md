# Day 60 Planning Agent Architecture

## Overview

The Day 60 Planning Agent is designed to handle
complex tasks by breaking them into smaller executable
steps.

The main architecture is:

User
↓
Goal
↓
Planner
↓
Plan Validation
↓
Executor
↓
Tools
↓
Observation
↓
Replanner
↓
Final Answer

---

## 1. User

The user provides a complex goal.

Example:

"Find the weather in Delhi and Mumbai,
compare them, and tell me which city is hotter."

---

## 2. Goal

The system identifies the objective.

Goal:

"Compare the weather in Delhi and Mumbai."

---

## 3. Planner

The planner decomposes the goal.

Example:

1. Get Delhi weather.
2. Get Mumbai weather.
3. Compare temperatures.
4. Generate final answer.

---

## 4. Structured Plan

The plan uses structured data.

Example:

{
"goal": "Compare Delhi and Mumbai weather",
"steps": [
{
"id": 1,
"description": "Get Delhi weather",
"tool": "weather",
"status": "pending"
},
{
"id": 2,
"description": "Get Mumbai weather",
"tool": "weather",
"status": "pending"
},
{
"id": 3,
"description": "Compare temperatures",
"tool": null,
"status": "pending"
}
]
}

---

## 5. Plan Validation

Every generated plan must be validated.

Validation checks:

- Plan exists
- Goal exists
- Steps exist
- Step IDs exist
- Step descriptions exist
- Tools are valid
- Step count is within limits

---

## 6. Tool Authorization

The planner can only use tools exposed by
the application.

Example:

Available tools:

- calculator
- search
- weather

If the LLM produces:

"sendMoney"

but the application does not expose that tool,
the plan must be rejected.

---

## 7. Executor

The executor runs one step at a time.

Example:

Plan
↓
Step 1
↓
Execute
↓
Observe
↓
Step 2
↓
Execute
↓
Observe

---

## 8. Tool Registry

The tool registry maps names to implementations.

Example:

calculator → calculatorTool

search → searchTool

weather → weatherTool

The executor requests the tool from the registry.

---

## 9. Planning State

Planning state stores task execution information.

Example:

{
"goal": "...",
"plan": [],
"currentStep": 0,
"completedSteps": [],
"failedSteps": [],
"observations": [],
"status": "running"
}

---

## 10. Observation

After every step, the agent records the result.

Example:

Step:

Get Delhi weather.

Observation:

Temperature = 35°C.

This observation can influence the next step.

---

## 11. Dynamic Replanning

If the result changes the situation,
the agent can modify the plan.

Example:

Initial plan:

1. Search hotels.
2. Compare prices.
3. Select cheapest.

Observation:

No hotels found.

New plan:

1. Search nearby areas.
2. Compare available hotels.
3. Select cheapest.

---

## 12. Static Planning

Static planning:

Plan
↓
Execute
↓
Complete

The plan does not change during execution.

---

## 13. Dynamic Planning

Dynamic planning:

Plan
↓
Execute
↓
Observe
↓
Replan
↓
Execute
↓
Observe
↓
Final

Dynamic planning is more flexible but has greater
implementation complexity.

---

## 14. Retry

Retry is used when the same operation may succeed
after a temporary failure.

Example:

Search
↓
Network error
↓
Retry search

Retry must have a maximum limit.

---

## 15. Replan

Replan is used when the current strategy is no longer
appropriate.

Example:

Search
↓
No results
↓
Change search strategy

---

## 16. Maximum Steps

The agent must have a maximum step limit.

Example:

MAX_STEPS = 10

This prevents infinite execution.

---

## 17. Maximum Retries

The agent should also have a retry limit.

Example:

MAX_RETRIES = 2

---

## 18. Execution Trace

The agent should record:

- Goal
- Plan
- Current step
- Tool calls
- Results
- Observations
- Failures
- Retries
- Final result

This makes the system easier to debug.

---

## 19. Day 59 Memory Integration

Day 59 provides conversation memory.

Day 60 adds planning state.

Combined architecture:

User
↓
Session
↓
Memory
↓
Goal
↓
Planner
↓
Plan
↓
Executor
↓
Tools
↓
Observation
↓
Replanner
↓
Final Answer

Memory stores conversational information.

Planning state stores task execution information.

---

## 20. LLM Planner

The deterministic planner can later be replaced
with an LLM planner.

Architecture:

User Goal
↓
LLM Planner
↓
Structured JSON
↓
Schema Validation
↓
Tool Authorization
↓
Executor
↓
Observation
↓
LLM Replanner
↓
Executor
↓
Final Answer

---

## 21. LLM Planning Rules

The planner should be instructed to:

1. Use only available tools.
2. Never invent tools.
3. Create minimal plans.
4. Give every step an ID.
5. Give every step a description.
6. Specify tools only when required.
7. Return structured JSON.

---

## 22. Production Guardrails

A production planning agent should implement:

- Maximum steps
- Maximum retries
- Maximum tool calls
- Token limits
- Timeouts
- Budget limits
- Tool authorization
- Input validation
- Output validation
- Logging
- Error handling

---

## 23. Security

Never directly execute arbitrary LLM output.

Unsafe:

LLM
↓
Execute

Safe:

LLM
↓
Validate
↓
Authorize
↓
Execute

---

## 24. Complete Execution Flow

User
↓
Goal Analyzer
↓
Plan Builder
↓
Plan Validator
↓
Execution Loop
↓
Tool Registry
↓
Tool
↓
Observation
↓
Decision
↓
Replan if required
↓
Final Answer

---

## 25. Main Project

Research Planning Agent

Goal:

"Research Node.js, Express.js and Next.js,
compare their backend use cases,
and recommend which one I should learn first."

Possible plan:

1. Research Node.js.
2. Research Express.js.
3. Research Next.js.
4. Compare use cases.
5. Generate recommendation.

The main objective is to demonstrate:

Plan
↓
Execute
↓
Observe
↓
Replan
↓
Final Answer
