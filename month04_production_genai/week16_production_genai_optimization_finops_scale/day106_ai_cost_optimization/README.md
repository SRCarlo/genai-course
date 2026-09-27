# Day 106 — AI Cost Optimization, FinOps & Production LLM Economics

**Week 16 — Production GenAI Optimization, FinOps & Scale**

## Stack

- Node.js
- JavaScript ES Modules
- Groq API
- `openai/gpt-oss-20b`
- dotenv
- Node built-in test runner

## Important API Change

If a Day 106 example mentions an OpenAI API call, this implementation replaces it with Groq.

There is no `openai` package in this project.

The live model is configured through:

```env
GROQ_MODEL=openai/gpt-oss-20b
```

## Setup

```powershell
cd day106_ai_cost_optimization
npm install
Copy-Item .env.example .env
```

Open `.env` and add:

```env
GROQ_API_KEY=your_real_groq_key
```

For live testing:

```env
ENABLE_LIVE_GROQ=true
```

## Cost Rates

Set your current Groq pricing in `.env`:

```env
INPUT_PRICE_PER_MILLION=YOUR_CURRENT_INPUT_RATE
OUTPUT_PRICE_PER_MILLION=YOUR_CURRENT_OUTPUT_RATE
```

Do not hard-code old pricing into the application.

## Run

```powershell
npm start
```

## Run tests

```powershell
npm test
```

## Generate report

```powershell
npm run report
```

## Project structure

```text
day106_ai_cost_optimization/
├── src/
│   ├── ai/
│   │   └── groq-client.js
│   ├── cost/
│   │   ├── cost-calculator.js
│   │   ├── cost-event.js
│   │   ├── cost-guard.js
│   │   ├── model-router.js
│   │   ├── embedding-cache.js
│   │   ├── semantic-cache.js
│   │   ├── conversation-compressor.js
│   │   └── retry-budget.js
│   ├── analytics/
│   │   └── cost-report.js
│   ├── config.js
│   └── index.js
├── evaluation/
│   └── cost/
│       ├── model-comparison.json
│       └── optimization-results.json
├── reports/
│   └── day106-cost-report.json
├── tests/
│   ├── cost/
│   │   ├── calculator.test.js
│   │   ├── budget.test.js
│   │   ├── router.test.js
│   │   └── cache.test.js
│   └── optimization/
│       └── optimization.test.js
├── notes/
│   └── day106_notes.md
├── assignment/
│   └── day106_assignment.md
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Git

```powershell
git add day106_ai_cost_optimization
git commit -m "feat(day106): initialize ai cost optimization project"

git add day106_ai_cost_optimization/src/cost
git commit -m "feat(day106): add ai cost tracking and controls"

git add day106_ai_cost_optimization/evaluation
git commit -m "test(day106): add ai cost optimization evaluations"

git add day106_ai_cost_optimization/tests
git commit -m "test(day106): add ai cost optimization tests"

git add day106_ai_cost_optimization/notes day106_ai_cost_optimization/assignment
git commit -m "docs(day106): document ai finops and cost optimization"

git push origin master
```
