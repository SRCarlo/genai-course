# Company Knowledge Agent — Frontend

Frontend client for the **Agentic RAG Knowledge Assistant** capstone project.

The frontend provides a simple interface for asking company-related questions, calculation questions, and follow-up questions. It communicates with the Node.js/Express backend through the `/api/agentic-rag` endpoint.

The backend is responsible for the agentic workflow, including ReAct reasoning, tool calling, RAG retrieval, calculator usage, conversation memory, query rewriting, source tracking, and error handling.

## Features

- Chat-style interface for interacting with the Company Knowledge Agent
- Submit questions to the Agentic RAG backend
- Display grounded final answers
- Display retrieved sources and metadata when returned by the API
- Support conversation sessions using a `sessionId`
- Support follow-up questions using backend conversation memory
- Display loading state while the agent is working
- Display API and validation errors safely
- Clear/reset conversation
- Responsive UI for desktop and mobile

## Application Flow

```text
User
  ↓
Frontend Chat UI
  ↓
POST /api/agentic-rag
  ↓
Express API
  ↓
Agent
  ↓
┌─────────────────────────┐
│                         │
▼                         ▼
RAG Search            Calculator
│                         │
▼                         ▼
Vector DB             Calculation
│                         │
└───────────┬─────────────┘
            ↓
          Agent
            ↓
      Grounded Answer
            ↓
     Sources + Metadata
            ↓
        Frontend UI
```

## Backend API

### Endpoint

```http
POST /api/agentic-rag
```

### Request

```json
{
  "sessionId": "user-001",
  "question": "What is our refund policy?"
}
```

### Example Response

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

The backend specification requires the `question` field to be a non-empty string. The frontend should validate obvious empty-input cases before making the request, while the backend remains the final validation boundary.

## Example Questions

### RAG Question

```text
What is our refund policy?
```

Expected behavior:

```text
Frontend
  ↓
Backend Agent
  ↓
knowledge_search
  ↓
refund-policy.txt
  ↓
Grounded Answer + Source
```

### Calculator Question

```text
What is 15% of ₹80,000?
```

Expected behavior:

```text
Frontend
  ↓
Backend Agent
  ↓
calculator
  ↓
₹12,000
```

The frontend does not need to decide whether a question requires RAG or the calculator. That decision belongs to the backend agent.

### RAG + Calculator

```text
According to our bonus policy,
what is 10% of ₹60,000?
```

Expected backend flow:

```text
knowledge_search
      ↓
bonus-policy.txt
      ↓
calculator
      ↓
₹6,000
```

### Follow-up Question

First ask:

```text
Tell me about the refund policy.
```

Then:

```text
What is its time limit?
```

The frontend should keep sending the same `sessionId` so the backend can use conversation memory and query rewriting.

## Suggested UI

A simple layout is sufficient:

```text
┌──────────────────────────────────────────────────────┐
│              Company Knowledge Agent                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  User: What is our refund policy?                    │
│                                                      │
│  Agent: Customers can request a refund within        │
│         30 days of purchase.                         │
│                                                      │
│  Sources:                                            │
│  • refund-policy.txt                                 │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Ask a question...                         [Send]    │
└──────────────────────────────────────────────────────┘
```

Recommended UI states:

- Empty state
- User message
- Assistant message
- Loading state
- Error state
- Sources section
- Input disabled while submitting
- Clear/reset conversation action

## Suggested Frontend Structure

Use a component structure similar to:

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow
│   │   │   ├── MessageList
│   │   │   ├── MessageBubble
│   │   │   └── ChatInput
│   │   ├── Sources/
│   │   │   └── SourceList
│   │   └── common/
│   │       ├── Loading
│   │       └── ErrorMessage
│   │
│   ├── services/
│   │   └── agentApi
│   │
│   ├── hooks/
│   │   └── useAgentChat
│   │
│   ├── utils/
│   │   └── session
│   │
│   ├── App
│   └── main
│
├── public/
├── .env.example
├── package.json
└── README.md
```

The exact framework and file names can be adapted to the frontend implementation.

## API Service

Keep API communication separate from UI components.

Conceptually:

```text
Chat Component
      ↓
useAgentChat
      ↓
agentApi
      ↓
POST /api/agentic-rag
```

Example request:

```javascript
const response = await fetch(`${API_BASE_URL}/api/agentic-rag`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sessionId,
    question,
  }),
});

const data = await response.json();
```

Do not expose LLM API keys, vector database credentials, or other backend secrets in the frontend.

## Environment Variables

The frontend only needs the public backend URL.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Do not put these values in frontend environment variables:

```env
LLM_API_KEY=
VECTOR_DB_API_KEY=
VECTOR_DB_URL=
```

Those credentials belong to the backend.

## Session Handling

The frontend should generate or maintain a session ID for a conversation.

Example:

```text
sessionId
   ↓
user-001
   ↓
Question 1
   ↓
Question 2
   ↓
Question 3
```

Keeping the same `sessionId` allows the backend conversation-memory layer to associate follow-up questions with the same conversation.

When the user starts a new conversation, generate a new session ID or reset the existing session.

## Error Handling

The frontend should handle at least:

- Empty question
- Failed network request
- Backend validation error
- LLM failure
- Vector database failure
- Tool failure
- Timeout
- Server error
- Unexpected response format

Example user-facing message:

```text
Sorry, something went wrong while processing your question.
Please try again.
```

Do not display:

- API keys
- Database credentials
- Internal stack traces
- System prompts
- Internal implementation secrets

## Loading State

Agentic requests can involve multiple steps such as:

```text
Question
  ↓
Agent Decision
  ↓
RAG Search / Calculator
  ↓
Observation
  ↓
Agent
  ↓
Final Answer
```

The frontend should therefore show a clear loading state while the request is being processed.

Example:

```text
Agent is thinking...
```

If the backend later exposes an agent trace or streaming API, the UI can be extended to display progress.

## Sources

When the API returns sources, display them separately from the answer.

Example:

```text
Answer
------
Customers can request a refund within 30 days of purchase.

Sources
-------
refund-policy.txt
```

Source information improves traceability and user trust.

The backend source-tracking model may include:

```json
{
  "source": "refund-policy.txt",
  "chunkId": "refund-02",
  "score": 0.91
}
```

The frontend should treat source metadata as display information and should not modify the retrieved content.

## Security Notes

The frontend is **not** the security boundary.

The backend must enforce:

- Authentication
- Authorization
- Input validation
- Rate limiting
- Tool permissions
- Document access permissions
- Maximum iterations
- Maximum tool calls
- Maximum RAG calls
- Timeout handling

In particular, authorization must be checked before retrieving confidential documents.

```text
User
  ↓
Authentication
  ↓
Authorization
  ↓
Allowed Document Scope
  ↓
RAG
```

The LLM should never be treated as the authorization layer.

## Testing

The frontend should be tested against the backend scenarios from the capstone testing matrix.

| Test Case                  | Expected Behavior                         |
| -------------------------- | ----------------------------------------- |
| Hello                      | Normal/direct response                    |
| What is JavaScript?        | No unnecessary RAG request                |
| Refund policy              | RAG-backed answer                         |
| Leave policy               | RAG-backed answer                         |
| 15% of 80000               | Calculator-backed answer                  |
| Bonus policy + calculation | RAG → Calculator                          |
| Unknown company policy     | No fabricated answer                      |
| Follow-up question         | Same session → memory/query rewrite → RAG |

Also test frontend-specific cases:

- Empty input
- Whitespace-only input
- Multiple submissions
- Loading state
- Network failure
- HTTP 400 response
- HTTP 500 response
- Malformed API response
- New conversation/session
- Long answers
- Multiple sources
- Mobile layout

## Local Development

Start the backend first.

From the backend directory:

```bash
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Then start the frontend using the package manager and development command configured by the frontend project.

For example, if the project uses Vite:

```bash
npm install
npm run dev
```

Open the development URL shown by the frontend development server.

## Backend Dependency

The frontend depends on the backend endpoint:

```text
POST http://localhost:5000/api/agentic-rag
```

Make sure the backend is running before testing the chat UI.

If frontend and backend run on different origins, configure the backend CORS policy appropriately.

## Project Goal

The goal of the frontend is not to reproduce the agent's internal reasoning.

Instead, it should provide a clean interface around the production-style Agentic RAG backend:

```text
Frontend
   ↓
API
   ↓
Agent
   ↓
Memory + RAG + Tools
   ↓
Grounded Answer
   ↓
Sources + Metadata
   ↓
Frontend
```

## Capstone Requirements Covered

The frontend integrates with the backend capabilities required by Day 63:

- ReAct agent
- Tool calling
- RAG
- Vector search
- Query rewriting
- Conversation memory
- Calculator
- Source tracking
- Error handling
- Express API
- Request validation

The backend remains responsible for implementing these capabilities; the frontend provides the user-facing experience.

## Future Improvements

Possible frontend enhancements include:

- Streaming agent responses
- Real-time agent trace visualization
- Source document preview
- Authentication UI
- Role-based document access
- Conversation history
- Persistent conversations
- Markdown rendering
- Code block rendering
- Retry failed requests
- Feedback buttons
- Dark mode
- File/document management UI

## Related Backend API

The main endpoint is:

```text
POST /api/agentic-rag
```

Example:

```json
{
  "sessionId": "user-001",
  "question": "What is our refund policy?"
}
```

Expected result:

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

---

**Day 63 Capstone — Company Knowledge Agent**

Frontend responsibility:

> Provide a clean, responsive, and safe interface for interacting with the Agentic RAG backend.

Backend responsibility:

> Decide when to use tools, retrieve company knowledge, perform calculations, maintain memory, enforce limits, and return grounded answers with source information.
