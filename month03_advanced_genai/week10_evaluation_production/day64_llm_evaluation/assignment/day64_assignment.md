# DAY 64 — LLM Evaluation Assignment

## Mandatory

- [ ] Create 20 evaluation questions
- [ ] Connect Day 63 Agentic RAG
- [ ] Implement retrieval evaluation
- [ ] Implement retrieval precision
- [ ] Implement retrieval recall
- [ ] Implement Top-K evaluation
- [ ] Implement answer evaluation
- [ ] Implement faithfulness evaluation
- [ ] Implement relevance evaluation
- [ ] Implement correctness evaluation
- [ ] Implement agent evaluation
- [ ] Evaluate tool selection
- [ ] Evaluate agent trajectory
- [ ] Track latency
- [ ] Track token usage where available
- [ ] Generate JSON evaluation report
- [ ] Add quality thresholds
- [ ] Add pass/fail logic
- [ ] Perform failure analysis
- [ ] Run regression tests

## Advanced

- [ ] Add LLM-as-a-judge
- [ ] Add P50 latency
- [ ] Add P95 latency
- [ ] Add maximum latency
- [ ] Add cost calculation
- [ ] Compare V1 and V2
- [ ] Add CI evaluation
- [ ] Automatically fail CI when quality falls below threshold

## Failure Analysis

For every failed test record:

Question

Expected Answer

Actual Answer

Retrieved Context

Expected Source

Tool Calls

Agent Trace

Latency

Why It Failed

Possible Fix

## Production Quality Gate

The evaluation should fail when:

Correctness < 90%

OR

Relevance < 90%

OR

Faithfulness < 95%

OR

Retrieval Recall < 90%

## Final Objective

The goal is not simply to make
the AI application work.

The goal is to prove that it
continues to work after changes.
