# API Documentation — Company Knowledge Agent

## Base URL

```text
http://localhost:5000
```

## Health Check

### GET `/health`

Checks whether the server is running.

### Example Response

```json
{
  "status": "ok",
  "service": "agentic-rag"
}
```

## Agentic RAG

### POST `/api/agentic-rag`

Runs the Agentic RAG workflow.

### Request Body

```json
{
  "sessionId": "user-001",
  "question": "What is our refund policy?"
}
```

### Validation

`question` must be a non-empty string.

Invalid input should return HTTP `400`.

### Example RAG Response

```json
{
  "answer": "Customers can request a refund within 30 days of purchase.",
  "sources": [
    {
      "source": "refund-policy.txt"
    }
  ]
}
```

## Example: Calculator

Question:

```text
What is 15% of ₹80,000?
```

Expected result:

```text
₹12,000
```

The agent should use the calculator without unnecessarily searching the vector database.

## Example: RAG + Calculator

Question:

```text
According to the bonus policy, what is 10% of ₹60,000?
```

Flow:

```text
knowledge_search
      ↓
bonus-policy.txt
      ↓
calculator
      ↓
6000
      ↓
final answer
```

## Error Handling

The API should safely handle:

- Invalid input
- LLM failure
- Vector DB failure
- Tool failure
- Timeout
- Maximum iterations
- Maximum tool calls
- Maximum RAG calls

Do not expose API keys, system prompts, database credentials, or internal stack traces.

## Test Requests

```text
POST /api/agentic-rag
```

Test questions:

1. What is our refund policy?
2. What is our leave policy?
3. What is 15% of 80000?
4. According to the bonus policy, what is 10% of 60000?
5. What is our Mars policy?
6. Tell me about the refund policy.
7. What is its time limit?
