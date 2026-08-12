# DAY 60 — Planning & Reasoning Agents

## Core Loop

Goal
↓
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
Final Answer

---

## What Is Planning?

Planning means breaking a large objective into smaller
executable steps.

Example:

Goal:

"Analyze company sales."

Plan:

1. Load sales data.
2. Validate data.
3. Calculate total sales.
4. Calculate monthly growth.
5. Identify best-performing products.
6. Generate summary.

---

## Planning vs Reasoning

### Planning

Planning answers:

"What should I do?"

Example:

1. Search
2. Calculate
3. Compare
4. Answer

### Reasoning

Reasoning answers:

"How should I decide what to do next?"

Example:

Search result found
↓
Check whether information is sufficient
↓
If not sufficient
↓
Search again

For production agents, expose actions,
state, and results instead of exposing private
chain-of-thought.

---

## Task Decomposition

Task decomposition means breaking a complex goal
into smaller manageable tasks.

Example:

Goal:

"Find the top 3 products by revenue."

Plan:

1. Load product sales.
2. Validate records.
3. Calculate revenue.
4. Sort by revenue.
5. Select top 3.
6. Generate answer.

---

## Static Planning

Static planning creates the plan once.

Plan
↓
Execute all steps

Example:

Goal
↓
Plan
↓
Step 1
↓
Step 2
↓
Step 3
↓
Final Answer

---

## Dynamic Planning

Dynamic planning can modify the plan based on
execution results.

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
Final Answer

---

## Plan → Execute → Observe

This is the main architecture for Day 60.

Plan:

Decide what steps are required.

Execute:

Run the current step using the required tool.

Observe:

Look at the result of the step.

Decide:

Determine whether the next step should continue
or whether the plan needs to change.

---

## Structured Plan

A plan should use structured data.

Example:

{
"goal": "Calculate average",
"steps": [
{
"id": 1,
"description": "Calculate sum",
"tool": "calculator",
"status": "pending",
"result": null
},
{
"id": 2,
"description": "Divide by count",
"tool": "calculator",
"status": "pending",
"result": null
}
]
}

---

## Why Structured Plans?

Structured plans provide:

- Easier validation
- Easier execution
- Easier debugging
- Easier logging
- Easier testing
- Easier UI visualization

---

## Plan Status

Each step has a lifecycle.

Normal flow:

pending
↓
running
↓
completed

Failure flow:

pending
↓
running
↓
failed

---

## Planning State

Planning state contains the current execution
information.

Example:

{
"goal": "Calculate average",
"plan": [],
"currentStep": 0,
"completedSteps": [],
"failedSteps": [],
"observations": [],
"status": "planning"
}

---

## Planning State vs Memory

Day 59:

Conversation state and memory.

Day 60:

Task execution state.

Day 59 remembers information about the conversation.

Day 60 manages information about the current task,
plan, steps, observations, and execution.

---

## Planner

The planner creates the steps required to complete
the user's goal.

The first version can use deterministic planning.

Example:

Goal:

"Calculate average"

Plan:

1. Calculate the sum.
2. Count the numbers.
3. Divide sum by count.

---

## Why Start With Deterministic Planning?

Before using an LLM for planning, understand:

- Planner
- Executor
- State
- Tools
- Observations

After that, the planner can be replaced with an
LLM-driven planner.

---

## Plan Validation

Never execute an LLM-generated plan directly.

Correct architecture:

LLM
↓
Structured JSON
↓
Plan Validation
↓
Tool Authorization
↓
Execution

Validation should check:

- Plan exists
- Goal exists
- Steps exist
- Step ID exists
- Step description exists
- Tool is valid
- Maximum number of steps

---

## Tool Registry

The tool registry maps tool names to actual tools.

Example:

calculator
↓
calculatorTool

search
↓
searchTool

database
↓
databaseTool

The executor should obtain tools through the registry.

---

## Plan Executor

The executor runs one step at a time.

Plan
↓
Step 1
↓
Result
↓
Step 2
↓
Result
↓
Step 3
↓
Final

The executor should not blindly execute every step
without checking results.

---

## Dynamic Replanning

Example:

Goal:

"Find the cheapest hotel."

Initial plan:

1. Search hotels.
2. Sort by price.
3. Return cheapest.

Search result:

"No hotels found."

The original plan is no longer useful.

New plan:

1. Search hotels in nearby areas.
2. Compare prices.
3. Return cheapest available hotel.

This is dynamic replanning.

---

## Retry vs Replan

### Retry

Retry repeats the same operation.

Example:

Search
↓
Network error
↓
Search again

### Replan

Replanning changes the strategy.

Example:

Search
↓
No results
↓
Search another source

Rule:

Temporary failure → Retry

Strategy failure → Replan

---

## Maximum Step Limit

Agents must have a maximum number of steps.

Example:

MAX_STEPS = 10

This prevents:

- Infinite loops
- Excessive cost
- Excessive latency
- Runaway tool calls

---

## Maximum Retry Limit

Agents should also limit retries.

Example:

MAX_RETRIES = 2

Do not retry indefinitely.

---

## Production Guardrails

Production planning agents should have:

- Maximum steps
- Maximum tool calls
- Maximum tokens
- Timeout
- Budget limit
- Tool authorization
- Input validation
- Output validation
- Retry limits
- Logging

---

## LLM Planning

An LLM planner can receive:

Goal:

"Calculate the average of 10, 20, 30, 40."

Available tools:

- calculator

The LLM should return structured JSON.

Example:

{
"goal": "Calculate average",
"steps": [
{
"id": 1,
"description": "Calculate the sum",
"tool": "calculator"
},
{
"id": 2,
"description": "Count the numbers",
"tool": null
},
{
"id": 3,
"description": "Divide sum by count",
"tool": "calculator"
}
]
}

---

## Tool-Aware Planning

The planner should know which tools are available.

Example:

Available tools:

- calculator
- search
- database

The planner should only select tools from this list.

Never allow the LLM to invent tools.

---

## Minimal Plans

Use the smallest reliable plan.

Bad:

1. Understand request.
2. Think about numbers.
3. Think about addition.
4. Check calculator.
5. Calculate.
6. Verify.
7. Think about response.
8. Format response.
9. Answer.

Better:

1. Calculate 10 + 20.
2. Return result.

More steps mean:

- More tokens
- More latency
- More tool calls
- More failure opportunities

---

## Agent Execution Trace

A useful trace looks like:

[PLAN]

Goal: Calculate average

[STEP 1]

Calculate sum

[TOOL]

calculator

[RESULT]

100

[STEP 2]

Count numbers

[RESULT]

4

[STEP 3]

100 / 4

[RESULT]

25

[FINAL]

Average = 25

---

## Failure Handling

If a step fails:

Step
↓
Failure
↓
Retry?
↓
Yes → Retry
No
↓
Alternative strategy?
↓
Yes → Replan
No
↓
Fail gracefully

---

## Day 59 + Day 60

Day 59:

User
↓
Session
↓
Memory
↓
Agent
↓
Tools
↓
Answer

Day 60:

User
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

---

## Day 60 Architecture

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
Tools / LLM
↓
Observe Result
↓
Decide Next Step
↓
Replan if required
↓
Final Answer

---

## Main Project

Research Planning Agent

Input:

"Research Node.js, Express.js and Next.js,
compare their backend use cases,
and recommend which one I should learn first."

Possible plan:

1. Research Node.js.
2. Research Express.js.
3. Research Next.js.
4. Compare backend use cases.
5. Generate recommendation.

Focus on the agent architecture rather than
perfect research quality.

---

## Important Principle

Never blindly execute an LLM-generated plan.

Correct flow:

LLM
↓
Validate
↓
Authorize
↓
Execute

---

## Final Learning

Day 60 introduces planning into the agent.

The agent is no longer only:

User
↓
LLM
↓
Answer

It becomes:

User
↓
Goal
↓
Plan
↓
Execute
↓
Observe
↓
Replan
↓
Final Answer
