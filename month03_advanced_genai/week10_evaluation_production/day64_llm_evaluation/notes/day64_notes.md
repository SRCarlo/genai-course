# DAY 64 — LLM Evaluation

## Main Goal

Learn how to measure the quality,
reliability, and performance of
Generative AI applications.

## Evaluation Layers

1. Retrieval
2. Context
3. Answer
4. Agent

## Retrieval Metrics

- Precision
- Recall
- Reciprocal Rank
- Top-1
- Top-3
- Top-5

## Answer Metrics

- Correctness
- Relevance
- Faithfulness

## Agent Metrics

- Tool selection
- Tool arguments
- Trajectory
- Final answer
- Tool efficiency
- Iteration count

## Production Metrics

- Latency
- P50 latency
- P95 latency
- Maximum latency
- Input tokens
- Output tokens
- Total tokens
- LLM calls
- Tool calls

## LLM-as-a-Judge

A second LLM evaluates the generated
answer against an expected answer
and retrieved context.

The judge evaluates:

- Correctness
- Relevance
- Faithfulness

LLM judges should not be blindly trusted.

They should be combined with:

- Deterministic tests
- Golden datasets
- Human evaluation
- Regression testing

## Retrieval Evaluation

Precision answers:

How many retrieved documents were relevant?

Recall answers:

Did the retriever find the required document?

## Faithfulness

Faithfulness measures whether
the generated answer is supported
by the retrieved context.

## Regression Testing

A fixed evaluation dataset should
be run after changes to:

- prompts
- models
- embeddings
- chunk sizes
- topK
- retrieval thresholds
- agent logic
- tools

## Evaluation Flow

Dataset
↓
AI Application
↓
Evaluator
↓
Metrics
↓
Quality Gate
↓
Report
↓
PASS / FAIL

## Important Concept

A successful HTTP request does not
necessarily mean a successful AI system.

An AI application can return HTTP 200
and still produce an incorrect answer.

## Production Principle

Software testing

- # AI evaluation
  Reliable GenAI application
