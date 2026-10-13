# Day 121 — GenAI Evaluation & Regression Testing

This is a Day 121 add-on kit for an existing Day 120 GenAI SaaS capstone. It does not replace your existing `src/` or chat service.

## Requirements
- Node.js 20+ recommended
- npm
- Optional: Groq API key for real-model evaluation

## 1. Copy files
Copy the `evals/` directory into the root of your existing Day 120 capstone. Merge the scripts from `package-scripts.json` into your existing `package.json`; do not replace your package.json.

## 2. Install the Groq SDK (only for real-model evaluation)
From the existing capstone root:
```powershell
npm install groq-sdk
```
The deterministic tests and sample evaluation do not require an API key.

## 3. Configure Groq (optional)
Set `GROQ_API_KEY` in your environment. Do not commit it.
PowerShell for the current terminal:
```powershell
$env:GROQ_API_KEY="your-groq-api-key"
$env:EVAL_USE_GROQ="true"
npm run eval
```
To run deterministic fixtures instead:
```powershell
$env:EVAL_USE_GROQ="false"
npm run eval
```

The Groq adapter uses model `openai/gpt-oss-20b`. The `openai/` prefix is part of the model ID; requests are sent to Groq via `groq-sdk`, not to OpenAI.

## 4. Run checks
```powershell
npm run test:eval
npm run eval
```
Output report: `evals/results/latest.json`.

## 5. Important integration note
The supplied adapter evaluates the synthetic dataset directly with Groq. To evaluate your actual RAG/chat app, replace `runChatEvaluation()` in `chat-adapter.js` with a call to your existing chat service and map its answer/citations into the documented result shape. Do not create a public endpoint that accepts arbitrary tenant IDs; use trusted test fixtures or authenticated test setup.

## Limitations
- Keyword/term overlap is a heuristic, not a reliable semantic groundedness measure.
- Deterministic fixtures test the evaluation framework, not model quality.
- Real-model results may vary. API/network/rate-limit errors should be handled and reported.
- Tenant isolation and entitlement enforcement must be tested as application security properties, not judged by an LLM.
