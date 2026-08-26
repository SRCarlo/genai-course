# Day 74 — LLM & Prompt Optimization

Production-oriented GenAI optimization project.

## Stack

- Node.js
- Express
- Groq API
- OpenAI GPT-OSS 20B
- Zod
- Jest

## Model

openai/gpt-oss-20b

## Provider

Groq

## Environment

Create `.env`:

GROQ_API_KEY=your_key

GROQ_MODEL=openai/gpt-oss-20b

PORT=3000

MIN_QUALITY=0.90

MAX_LATENCY_MS=2000

MAX_COST_PER_REQUEST=0.005

## Install

npm install

## Development

npm run dev

## Tests

npm test

## Benchmark

node src/evaluation/run-all.js

## Temperature Experiment

node src/evaluation/temperature.js

## Health

GET /health

## Create Experiment

POST /api/optimization/experiments

## Run Experiment

POST /api/optimization/experiments/:id/run

## Get Experiment

GET /api/optimization/experiments/:id

## Routing

POST /api/optimization/route

## Structured Output

POST /api/optimization/structured-output

## Optimization Architecture

User
↓
Router
↓
Prompt Version
↓
Groq GPT-OSS 20B
↓
Validation
↓
Response
↓
Quality / Cost / Latency
↓
Experiment
↓
Optimization

## Core Principle

Measure first.

Change one thing.

Evaluate again.

Never optimize cost at the expense of unacceptable quality.
