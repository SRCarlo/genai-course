# 🔐 Day 88 — Secure AI Agent Authorization Gateway

A production-oriented Node.js project implementing the Day 88 concepts:

- AI agent identity
- Authentication vs authorization
- RBAC
- ABAC-style policy checks
- User + agent delegated authorization
- Least privilege
- Tool scopes
- Resource-level authorization
- Zod argument validation
- Central tool gateway
- Risk classification
- Human approval
- Audit logging
- Groq AI planning with `openai/gpt-oss-20b`
- Security-focused tests

The architecture follows the Day 88 principle:

> The LLM decides what it wants to do. The application decides what it is allowed to do.

## Architecture

```text
User
  ↓
Authentication / Identity
  ↓
AI Agent
  ↓
Groq GPT-OSS 20B (planning only)
  ↓
Tool Request
  ↓
Tool Gateway
  ├── Tool exists?
  ├── User permission?
  ├── Agent permission?
  ├── Resource authorization?
  ├── Zod argument validation?
  ├── Risk policy?
  ├── Human approval?
  ↓
Tool Execution
  ↓
Audit Log
```

## Tech Stack

- Node.js
- Express
- Zod
- Groq SDK
- OpenAI GPT-OSS 20B via Groq
- Node.js built-in test runner

## Setup

```bash
git clone <your-repository-url>
cd day88_agent_authorization
npm install
```

Create `.env`:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

Start:

```bash
npm start
```

Development:

```bash
npm run dev
```

Tests:

```bash
npm test
```

## API

### Health

```http
GET /api/agent/health
```

### Direct secure tool request

```http
POST /api/agent/authorize
Content-Type: application/json
```

Example:

```json
{
  "user": {
    "id": "user-123",
    "role": "support"
  },
  "agentType": "support",
  "tool": "searchOrders",
  "arguments": {
    "customerId": "user-123"
  }
}
```

### High-risk refund

Without approval:

```json
{
  "user": {
    "id": "manager-1",
    "role": "manager"
  },
  "agentType": "finance",
  "tool": "refundOrder",
  "arguments": {
    "orderId": "ORD-1",
    "reason": "Customer requested refund"
  }
}
```

Expected:

```json
{
  "status": "APPROVAL_REQUIRED"
}
```

With `"approved": true`, the gateway executes the tool.

### Groq planning endpoint

```http
POST /api/agent/plan
Content-Type: application/json
```

```json
{
  "message": "Refund order ORD-1 because the customer requested it."
}
```

Important: this endpoint only creates an AI plan. The plan is not trusted or executed automatically. It must go through `/api/agent/authorize`.

## Security Matrix

| Agent | Tool | Permission | Risk | Result |
|---|---|---|---|---|
| Support | Search Orders | order:read | Low | Allow |
| Support | Refund | order:refund | High | Deny |
| Finance | Refund | order:refund | High | Approval |
| Admin | Delete Customer | customer:delete | Critical | Approval |
| Customer | Delete Customer | customer:delete | Critical | Deny |

## Folder Structure

```text
day88_agent_authorization/
├── src/
│   ├── agents/
│   ├── ai/
│   ├── routes/
│   ├── security/
│   ├── tools/
│   └── app.js
├── tests/
├── notes/
├── assignment/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Git

```bash
git init
git add .
git commit -m "feat(day88): build secure AI agent authorization gateway"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```
