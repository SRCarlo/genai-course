# Day 105 — AI Governance, Compliance & Production AI Policies

This project implements the Day 105 governance concepts:

- AI system registry
- model registry
- risk registry
- risk calculation
- data governance
- retention policy
- human-in-the-loop approval
- governance review
- AI system card
- governance evidence
- optional Groq AI integration

## AI Provider

This project uses:

- Provider: Groq
- Model: `openai/gpt-oss-20b`

No OpenAI API is required.

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

Never commit `.env`.

## Run governance demo

```powershell
npm run demo
```

## Run tests

```powershell
npm test
```

## Run Groq demo

```powershell
npm run groq
```

The Groq demo first applies data and action governance checks and only then makes the model call.

## Git

```powershell
git add .
git commit -m "feat(day105): complete ai governance project"
git push origin master
```

All data in this repository is synthetic/demo data.
