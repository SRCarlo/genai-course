# DAY 78 ASSIGNMENT

## Basic

- [x] Create agent state
- [x] Create planner
- [x] Create decision module
- [x] Create orchestrator
- [x] Create termination logic
- [x] Add tool execution
- [x] Add observation storage
- [x] Add final answer state

## Intermediate

- [x] Add retry handling
- [x] Add exponential backoff
- [x] Add timeout
- [x] Add maximum iterations
- [x] Add maximum tool calls
- [x] Add LLM-call limits
- [x] Add clarification state
- [x] Add short-term memory
- [x] Add structured agent events

## Advanced

- [x] Add long-term memory foundation
- [x] Add checkpointing
- [x] Add agent recovery foundation
- [x] Add human approval
- [x] Add tool risk levels
- [ ] Add real cost calculation
- [ ] Add context compression
- [ ] Add parallel tool execution
- [x] Add agent tracing foundation
- [ ] Build evaluation dataset

## Project

Build a production customer-support agent capable of:

1. Answering refund policy questions.
2. Checking orders.
3. Performing calculations.
4. Comparing an order against refund policy.
5. Handling cancellation requests safely.

## Test cases

### Test 1

What is the refund policy?

Expected:

searchKnowledgeBase

### Test 2

Check ORD-1001.

Expected:

getOrder

### Test 3

Calculate 20% of 5000.

Expected:

calculate

### Test 4

Check ORD-1001 and tell me whether it qualifies for a refund.

Expected:

getOrder
↓
searchKnowledgeBase
↓
final answer

### Test 5

Check my order.

Expected:

waiting_for_user

### Test 6

Cancel ORD-1001.

Expected:

waiting_for_approval
