# Day 100 — Production RAG Evaluation & Observability

## Core idea

Production RAG must be measurable.

A production system needs both:

1. AI pipeline
2. Measurement/observability pipeline

## RAG evaluation layers

### Retrieval

- Recall@K
- Precision@K
- MRR

### Context

- Context relevance
- Source quality
- Context completeness

### Generation

- Faithfulness
- Answer relevance
- Groundedness

## Failure analysis

If the correct document was not retrieved:

- chunking problem
- embedding problem
- query problem
- search problem
- ranking problem
- metadata filter problem

If the correct document was retrieved but the answer is wrong:

- context construction problem
- prompt problem
- LLM problem
- output validation problem

## Observability

Track:

- request ID
- traces
- logs
- latency
- P50
- P95
- P99
- token usage
- cost
- error types

## Golden dataset

A golden dataset contains representative evaluation questions and expected relevant documents or answer characteristics.

Use it for:

- regression testing
- model comparison
- embedding comparison
- retrieval comparison
- prompt comparison

## Quality gate

A quality gate compares evaluation results with predefined thresholds.

Example:

- Recall@5 >= 0.85
- Faithfulness >= 0.90
- Answer Relevance >= 0.85

## Continuous improvement

Build
→ Evaluate
→ Deploy
→ Observe
→ Analyze Failures
→ Improve
→ Evaluate Again

## Important principle

A production AI engineer should be able to answer:

> Why did this answer happen?

The system should provide enough traces, retrieval results, metrics and logs to investigate that question.
