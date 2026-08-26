# DAY 74 — LLM & PROMPT OPTIMIZATION

## Main Goal

Improve GenAI quality while controlling:

- quality
- cost
- latency
- reliability

## Groq Configuration

Provider:

Groq

Model:

openai/gpt-oss-20b

Base API:

https://api.groq.com/openai/v1

Environment variable:

GROQ_API_KEY

## Prompt Optimization

Do not optimize prompts based only on personal opinion.

Use:

Prompt
↓
Dataset
↓
Evaluation
↓
Score
↓
Comparison

## Prompt Versioning

Versions:

v1
v2
v3

Track:

- prompt version
- model
- dataset
- temperature
- evaluation version

## Few-Shot Prompting

Provide examples to demonstrate expected behavior.

Useful for:

- classification
- extraction
- formatting
- domain-specific behavior

But examples increase input tokens.

Therefore:

Measure quality improvement
against
additional cost and latency.

## Temperature

Lower temperature generally produces more deterministic behavior.

Higher temperature produces more variation.

Always benchmark parameter changes.

## Token Optimization

Reduce unnecessary:

- system prompt
- conversation history
- RAG context
- output tokens

## Context Optimization

Retrieve
↓
Filter
↓
Rerank
↓
Compress
↓
LLM

## Conversation Optimization

Use:

Recent messages

- Summary
- Relevant memory

instead of sending the complete conversation every time.

## Model Routing

Route requests according to:

- complexity
- quality requirement
- cost budget
- latency requirement
- task type

Current Day 74 implementation:

openai/gpt-oss-20b

The routing abstraction is implemented so additional models can be introduced later.

## Structured Output

LLM
↓
JSON Schema
↓
Validation
↓
Application

Groq GPT-OSS 20B supports structured outputs.

## Optimization Constraints

Example:

Quality >= 0.90
Latency <= 2000ms
Cost <= $0.005/request

## A/B Testing

Prompt A
vs
Prompt B

Compare:

- quality
- cost
- latency
- user feedback

## Production Optimization Loop

Observe
↓
Measure
↓
Hypothesis
↓
Change ONE thing
↓
Evaluate
↓
Compare
↓
Deploy
↓
Monitor

## Core Principle

Do not optimize blindly.

Measure first.

Change one thing.

Evaluate again.
