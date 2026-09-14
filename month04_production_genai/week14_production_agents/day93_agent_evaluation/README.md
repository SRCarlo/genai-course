# Day 93 — Agent Evaluation

A complete Node.js implementation of the Day 93 Agent Evaluation framework.

## Stack

- Node.js + ES modules
- Groq SDK
- Groq model: `openai/gpt-oss-20b`
- Zod for schema validation
- Node built-in test runner

## Setup

```bash
npm install
cp .env.example .env
```

Put your Groq API key in `.env`:

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

## Run the evaluation

```bash
npm run evaluate
```

The report is written to `reports/evaluation-report.json` and `reports/evaluation-report.md`.

## Run tests

```bash
npm test
```

## Important

The framework uses deterministic checks first, then optionally uses the Groq LLM judge. The API key is never stored in source code.
