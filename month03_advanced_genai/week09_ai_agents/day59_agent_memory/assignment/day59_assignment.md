# Day 59 Assignment — Agent Memory & State Management

---

# 1. Assignment Objective

Build a stateful conversational AI agent using:

```text
Node.js
Express
Groq API
Conversation Memory
Session IDs
Agent State
Tool Calling
Thunder Client
```

The agent must remember relevant information across multiple requests.

---

# 2. Learning Objectives

By completing this assignment, you should understand:

- Stateless agents
- Stateful agents
- Conversation state
- Session IDs
- Conversation memory
- Memory stores
- Memory managers
- Message history
- Memory trimming
- Context limits
- Agent state
- Session isolation
- Memory + tools
- Memory vs RAG
- Storage abstraction
- Production memory considerations

---

# 3. Project Requirements

The project should contain:

```text
day59_agent_memory/
│
├── backend/
│   ├── agent/
│   │   ├── chatAgent.js
│   │   └── agentState.js
│   │
│   ├── memory/
│   │   ├── memoryStore.js
│   │   ├── memoryManager.js
│   │   └── conversationMemory.js
│   │
│   ├── session/
│   │   └── sessionManager.js
│   │
│   ├── services/
│   │   └── llmService.js
│   │
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── memoryController.js
│   │   └── historyController.js
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   └── server.js
│
├── tests/
│   └── memory.test.js
│
├── notes/
│   └── day59_notes.md
│
├── docs/
│   └── memory-architecture.md
│
├── assignment/
│   └── day59_assignment.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 4. Task 1 — Implement Memory Store

Create a memory store using JavaScript `Map`.

Required functions:

```javascript
getConversation(sessionId);

saveConversation(sessionId, messages);

clearConversation(sessionId);
```

The data structure should conceptually be:

```text
sessionId
   ↓
messages[]
```

Example:

```text
session-001
   ↓
[
  user message,
  assistant message
]
```

---

# 5. Task 2 — Implement Memory Manager

Create a memory manager that hides the storage implementation.

Required functions:

```javascript
getMessages(sessionId);

addMessage(sessionId, message);

clearMemory(sessionId);
```

The controller and agent should not directly access the `Map`.

Architecture:

```text
Controller
    ↓
Agent
    ↓
Memory Manager
    ↓
Memory Store
```

---

# 6. Task 3 — Implement Conversation Memory

Create high-level conversation functions:

```javascript
getConversationMessages(sessionId);

addUserMessage(sessionId, content);

addAssistantMessage(sessionId, content);
```

Messages should use the appropriate role:

```javascript
{
  role: "user",
  content: "Hello"
}
```

and:

```javascript
{
  role: "assistant",
  content: "Hello! How can I help?"
}
```

---

# 7. Task 4 — Implement Session Management

Create a session manager.

Generate unique session IDs using UUID.

Example:

```javascript
crypto.randomUUID();
```

Do not use:

```text
Shubham
Carlo
user1
user2
```

as production session IDs.

---

# 8. Task 5 — Implement Groq LLM Service

Use Groq as the LLM provider.

Environment variables:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
MAX_MESSAGES=10
```

The API key must never be committed to Git.

The LLM service should expose a function such as:

```javascript
callLLM(messages);
```

---

# 9. Task 6 — Implement Stateful Chat

Create:

```http
POST /api/chat
```

Request:

```json
{
  "sessionId": "session-001",
  "message": "My name is Shubham."
}
```

The system should:

```text
Receive message
     ↓
Store user message
     ↓
Load conversation
     ↓
Call Groq
     ↓
Store assistant response
     ↓
Return response
```

---

# 10. Task 7 — Test Basic Memory

Use Thunder Client.

### Request 1

```http
POST http://localhost:3000/api/chat
```

Body:

```json
{
  "sessionId": "session-001",
  "message": "My name is Shubham."
}
```

Then send:

```json
{
  "sessionId": "session-001",
  "message": "What is my name?"
}
```

Expected result:

```text
Your name is Shubham.
```

The exact wording may vary.

---

# 11. Task 8 — Test Multiple Memories

Send:

```json
{
  "sessionId": "session-001",
  "message": "I am learning JavaScript and Generative AI."
}
```

Then:

```json
{
  "sessionId": "session-001",
  "message": "What am I learning?"
}
```

Expected:

```text
JavaScript and Generative AI
```

---

# 12. Task 9 — Test Session Isolation

### Session A

```json
{
  "sessionId": "session-A",
  "message": "My favorite language is JavaScript."
}
```

### Session B

```json
{
  "sessionId": "session-B",
  "message": "My favorite language is Java."
}
```

Ask both:

```json
{
  "sessionId": "session-A",
  "message": "What is my favorite language?"
}
```

Expected:

```text
JavaScript
```

Then:

```json
{
  "sessionId": "session-B",
  "message": "What is my favorite language?"
}
```

Expected:

```text
Java
```

---

# 13. Task 10 — Implement Memory Trimming

Configure:

```env
MAX_MESSAGES=10
```

When messages exceed the configured limit, keep only the latest messages.

Example:

```javascript
const trimmed = messages.slice(-MAX_MESSAGES);
```

Verify that old messages are removed from the active memory window.

---

# 14. Task 11 — Implement History API

Create:

```http
GET /api/chat/:sessionId/history
```

Example:

```http
GET /api/chat/session-001/history
```

Expected response:

```json
{
  "sessionId": "session-001",
  "messages": [
    {
      "role": "user",
      "content": "My name is Shubham."
    },
    {
      "role": "assistant",
      "content": "Nice to meet you, Shubham."
    }
  ]
}
```

---

# 15. Task 12 — Implement Clear Memory

Create:

```http
DELETE /api/chat/:sessionId
```

Example:

```http
DELETE /api/chat/session-001
```

Expected:

```json
{
  "sessionId": "session-001",
  "message": "Conversation memory cleared successfully."
}
```

After clearing memory, verify:

```http
GET /api/chat/session-001/history
```

returns:

```json
{
  "sessionId": "session-001",
  "messages": []
}
```

---

# 16. Task 13 — Implement Agent State

Create an agent state object containing at least:

```javascript
{
  (sessionId,
    userMessage,
    messages,
    toolCalls,
    toolResults,
    currentStep,
    status,
    error);
}
```

Example:

```javascript
{
  sessionId: "session-001",
  userMessage: "Calculate 25 * 40",
  messages: [],
  toolCalls: [],
  toolResults: [],
  currentStep: 0,
  status: "running",
  error: null
}
```

---

# 17. Task 14 — Integrate Day 58 Tools

Integrate the memory system with the Day 58 tool-calling agent.

The architecture should become:

```text
User
 ↓
Memory
 ↓
Agent
 ↓
Groq
 ↓
Tool Decision
 ↓
Tool
 ↓
Tool Result
 ↓
Groq
 ↓
Final Answer
 ↓
Memory
```

---

# 18. Task 15 — Test Memory + Tool Calling

First send:

```json
{
  "sessionId": "tool-memory-001",
  "message": "My name is Shubham."
}
```

Then:

```json
{
  "sessionId": "tool-memory-001",
  "message": "Calculate 25 multiplied by 40."
}
```

The calculator tool should produce:

```text
1000
```

Then send:

```json
{
  "sessionId": "tool-memory-001",
  "message": "What is my name?"
}
```

Expected:

```text
Shubham
```

This demonstrates:

```text
Memory
+
Tool Calling
```

working together.

---

# 19. Task 16 — Write Unit Tests

Create:

```text
tests/memory.test.js
```

Test at least:

```text
✓ Store conversation
✓ Retrieve conversation
✓ Add message
✓ Clear conversation
✓ Session isolation
✓ Memory trimming
```

---

# 20. Task 17 — Documentation

Complete:

```text
notes/day59_notes.md
docs/memory-architecture.md
assignment/day59_assignment.md
```

Documentation should explain:

```text
Stateless vs stateful
Memory
State
Session IDs
Memory Store
Memory Manager
Memory trimming
Session isolation
Memory vs RAG
Agent state
Memory + tools
Map vs Redis
```

---

# 21. Bonus Task — Conversation Summary

Implement a simple conversation summary.

Example:

```text
Original:

My name is Shubham.
I am a JavaScript developer.
I use Node.js.
I am learning Generative AI.
```

Summary:

```text
Shubham is a JavaScript and Node.js developer
who is learning Generative AI.
```

Use:

```text
Summary
+
Recent messages
+
Current message
```

instead of sending the entire conversation history.

---

# 22. Bonus Task — Redis-Ready Design

Do not implement Redis yet unless desired.

Instead, make sure your architecture supports:

```text
MapMemoryStore
```

today and:

```text
RedisMemoryStore
```

later.

The agent should continue using:

```text
Memory Manager
```

without knowing whether the storage is:

```text
Map
Redis
Database
```

---

# 23. Thunder Client Test Checklist

Create a Thunder Client collection called:

```text
Day 59 - Agent Memory
```

Include:

```text
01 - Store Name
02 - Recall Name
03 - Store Preference
04 - Recall Preference
05 - Tool Calculation
06 - Recall Memory After Tool
07 - Session Isolation A
08 - Session Isolation B
09 - Get History
10 - Clear Memory
11 - Verify Memory Cleared
```

---

# 24. Expected Results

| Test              | Expected                    |
| ----------------- | --------------------------- |
| Store name        | Message saved               |
| Recall name       | Correct name returned       |
| Store preference  | Preference saved            |
| Recall preference | Correct preference returned |
| Tool calculation  | Correct tool result         |
| Memory after tool | Previous memory available   |
| Session A         | Only A's memory             |
| Session B         | Only B's memory             |
| History           | Stored messages returned    |
| Clear memory      | Memory removed              |
| Verify clear      | Empty history               |

---

# 25. Interview Questions

## Q1. What is agent memory?

A mechanism for retaining and retrieving information across agent interactions or during an agent workflow.

## Q2. What is the difference between state and memory?

State tracks information needed by the current workflow, while memory generally refers to information retained for future use.

## Q3. Why use session IDs?

To associate requests with the correct conversation state.

## Q4. Why isolate sessions?

To prevent one user's information from leaking into another user's conversation.

## Q5. Why trim conversation history?

To control token usage, cost, latency, and context size.

## Q6. Is RAG the same as memory?

No.

Memory generally stores user, conversation, or agent information. RAG retrieves external knowledge.

## Q7. Why use a memory abstraction?

To allow the storage implementation to change from Map to Redis or a database without rewriting the agent.

## Q8. Why shouldn't a client-provided session ID be blindly trusted?

Because an attacker could attempt to access another user's session.

## Q9. What can agent state contain?

Examples include:

```text
sessionId
messages
toolCalls
toolResults
currentStep
status
errors
```

## Q10. How can long conversations be managed?

Possible techniques include:

```text
Message trimming
Token-based trimming
Conversation summaries
Long-term memory
Relevant retrieval
RAG
```

---

# 26. Completion Checklist

## Theory

- [ ] Stateless vs stateful
- [ ] Context
- [ ] State
- [ ] Memory
- [ ] Conversation history
- [ ] Session IDs
- [ ] Short-term memory
- [ ] Persistent memory concepts
- [ ] Memory trimming
- [ ] Memory vs RAG

## Backend

- [ ] Memory Store
- [ ] Memory Manager
- [ ] Conversation Memory
- [ ] Session Manager
- [ ] Agent State
- [ ] Groq LLM Service
- [ ] Chat Controller
- [ ] Chat Route
- [ ] History Endpoint
- [ ] Clear Memory Endpoint

## Agent

- [ ] Memory integrated
- [ ] Agent state integrated
- [ ] Day 58 tools integrated
- [ ] Memory + tool calling tested

## Security

- [ ] Session isolation
- [ ] Authentication awareness
- [ ] API key stored in `.env`
- [ ] `.env` excluded from Git
- [ ] Client session IDs not blindly trusted

## Testing

- [ ] Basic memory
- [ ] Multi-turn conversation
- [ ] Session isolation
- [ ] Memory trimming
- [ ] History endpoint
- [ ] Clear memory
- [ ] Memory + tool calling
- [ ] Unit tests

## Documentation

- [ ] `day59_notes.md`
- [ ] `memory-architecture.md`
- [ ] `day59_assignment.md`

## Git

- [ ] Memory commit
- [ ] Session commit
- [ ] Agent state commit
- [ ] API commit
- [ ] Test commit
- [ ] Documentation commit
- [ ] `git status` checked
- [ ] Changes pushed

---

# 27. Final Day 59 Architecture

The completed system should look like:

```text
                         USER
                           │
                           ▼
                     Express API
                           │
                           ▼
                     Session ID
                           │
                           ▼
                    Memory Manager
                           │
                           ▼
                    Conversation
                       History
                           │
                           ▼
                         Agent
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
               Groq      Tools       RAG
                │          │
                └──────────┼──────────┘
                           ▼
                      Agent State
                           │
                           ▼
                    Memory Update
                           │
                           ▼
                        Response
```

---

# 28. Final Goal

The Day 59 agent should be able to:

```text
Remember
     ↓
Reason
     ↓
Call Tools
     ↓
Track State
     ↓
Update Memory
     ↓
Respond
```

The key principle learned today is:

> A reliable conversational agent requires more than an LLM. It needs controlled state, session-aware memory, bounded context, tool integration, and a clear storage abstraction.
