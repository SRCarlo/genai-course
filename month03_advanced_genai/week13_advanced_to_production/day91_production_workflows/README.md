# Day 91 — Production Agent Workflows

A production-style Node.js AI workflow demonstrating:

- deterministic workflow steps
- Groq `openai/gpt-oss-20b` agent decision
- workflow state
- checkpoints
- resumability
- human approval
- retries
- exponential backoff + jitter
- idempotency
- background jobs
- cancellation
- audit logging
- optimistic concurrency
- automated tests

## Architecture

```text
Client
  ↓
Express API
  ↓
Create Workflow Job
  ↓
Background Queue
  ↓
Worker
  ↓
Workflow Runner
  ├── Deterministic Steps
  └── Agent Step → Groq GPT-OSS 20B
          ↓
        Policy
          ↓
   Human Approval when needed
          ↓
        Tools
          ↓
       State
          ↓
     Checkpoint
          ↓
       Resume
```

## Requirements

- Node.js 20+
- Groq API key

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
REFUND_APPROVAL_THRESHOLD=10000
MAX_RETRIES=3
```

## 3. Start

```bash
npm start
```

Development:

```bash
npm run dev
```

## 4. Create a normal refund workflow

```bash
curl -X POST http://localhost:3000/workflows/refund \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"user-1\",\"orderId\":\"12345\"}"
```

Expected:

```json
{
  "workflowId": "wf-...",
  "status": "queued"
}
```

Then:

```bash
curl http://localhost:3000/workflows/YOUR_WORKFLOW_ID
```

## 5. Test high-value approval

Order `20000` is configured as ₹25,000.

```bash
curl -X POST http://localhost:3000/workflows/refund \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"user-1\",\"orderId\":\"20000\"}"
```

The workflow should enter:

```text
waiting_approval
```

Approve:

```bash
curl -X POST http://localhost:3000/approvals/YOUR_WORKFLOW_ID/approve \
  -H "Content-Type: application/json" \
  -d "{\"approvedBy\":\"admin\"}"
```

Reject:

```bash
curl -X POST http://localhost:3000/approvals/YOUR_WORKFLOW_ID/reject \
  -H "Content-Type: application/json" \
  -d "{\"rejectedBy\":\"admin\"}"
```

## 6. Test an ineligible order

Order `99999` is configured as ineligible:

```bash
curl -X POST http://localhost:3000/workflows/refund \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"user-1\",\"orderId\":\"99999\"}"
```

The workflow completes without executing the refund.

## 7. Run tests

```bash
npm test
```

## Important production note

This project uses an in-memory workflow store and an in-memory queue so that the Day 91 concepts are easy to understand.

For a real production system, replace them with durable infrastructure such as PostgreSQL and a durable queue/workflow engine. Persist workflow state, step state, approvals, idempotency keys, and audit events.

## Security

- Never put `GROQ_API_KEY` in frontend code.
- Never commit `.env`.
- Keep refund execution behind deterministic policy checks.
- Treat LLM output as untrusted data.
- Validate agent output before side effects.
