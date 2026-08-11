# DAY 59 — Agent Memory & State Management

---

## 1. Day 59 Goal

The goal of Day 59 is to move from a stateless agent to a stateful conversational agent.

### Stateless Agent

```text
User
 ↓
Agent
 ↓
Groq LLM
 ↓
Response
```

Each request is independent.

### Stateful Agent

```text
User
 ↓
Session
 ↓
Memory
 ↓
Agent
 ↓
Groq LLM
 ↓
Tools
 ↓
Memory Update
 ↓
Response
```

The application stores relevant information between requests.

---

# 2. Stateless vs Stateful

## Stateless

A stateless application does not automatically retain previous conversation information.

Example:

```text
Request 1:
My name is Shubham.

Response:
Nice to meet you, Shubham.

Request 2:
What is my name?

Response:
I don't know your name.
```

The second request does not have the previous context.

---

## Stateful

A stateful application stores information associated with a session.

```text
Request 1
   ↓
Memory
   ↓
Request 2
   ↓
Memory
   ↓
Request 3
```

Example:

```text
User:
My name is Shubham.

Agent:
Nice to meet you, Shubham.

User:
What is my name?

Agent:
Your name is Shubham.
```

---

# 3. Context, State and Memory

These terms are related but different.

## Context

Information provided to the LLM for the current generation.

Example:

```text
System instructions
+
Previous messages
+
Current user message
```

---

## State

Information required to track the current application or agent workflow.

Example:

```javascript
{
  sessionId: "session-001",
  currentStep: 2,
  status: "running",
  toolCalls: [],
  toolResults: []
}
```

---

## Memory

Information retained so that it can be used later.

Examples:

```text
User name
User preferences
Conversation history
Previous tool results
Conversation summary
```

---

# 4. Conversation Memory

Conversation memory is commonly represented as messages.

Example:

```javascript
const messages = [
  {
    role: "user",
    content: "My name is Shubham.",
  },
  {
    role: "assistant",
    content: "Nice to meet you, Shubham.",
  },
  {
    role: "user",
    content: "What is my name?",
  },
];
```

The application sends relevant history to Groq.

---

# 5. Message Roles

A conversation can contain different message roles.

Common roles include:

```text
system
user
assistant
tool
```

Example:

```javascript
[
  {
    role: "system",
    content: "You are a helpful AI assistant.",
  },
  {
    role: "user",
    content: "Calculate 25 * 40.",
  },
  {
    role: "assistant",
    content: "I will calculate that.",
  },
];
```

Tool-calling agents can also contain tool-related messages depending on the implementation.

---

# 6. Session ID

A session ID identifies a conversation.

Example:

```text
session-001
session-002
session-003
```

Memory can then be organized as:

```text
session-001
    ↓
Conversation A

session-002
    ↓
Conversation B
```

A production application should normally use a secure unique identifier such as a UUID.

Example:

```javascript
import crypto from "crypto";

export function createSessionId() {
  return crypto.randomUUID();
}
```

---

# 7. Session Isolation

Each session must have independent memory.

Example:

```text
session-001
    ↓
Shubham
    ↓
JavaScript

session-002
    ↓
Carlo
    ↓
Java
```

Session 001 must never receive session 002's information.

This is both an architectural and security requirement.

---

# 8. Memory Store

For Day 59, memory is implemented using JavaScript `Map`.

Example:

```javascript
const conversations = new Map();
```

Conceptually:

```text
Map

session-001
    ↓
[
  message,
  message,
  message
]

session-002
    ↓
[
  message,
  message
]
```

Basic operations:

```javascript
getConversation(sessionId);

saveConversation(sessionId, messages);

clearConversation(sessionId);
```

---

# 9. Why Use Map?

`Map` is useful for learning because it provides simple key-value storage.

```text
sessionId → messages
```

Example:

```javascript
conversations.set("session-001", messages);
```

However, an in-memory `Map` has limitations.

It is:

```text
Temporary
Not shared between server instances
Lost when server restarts
Not suitable for large production workloads
```

Later, the storage layer can be replaced with Redis or a database.

---

# 10. Memory Manager

The application should not directly access the storage implementation.

Preferred architecture:

```text
Controller
    ↓
Memory Manager
    ↓
Memory Store
```

The Memory Manager provides operations such as:

```javascript
getMessages(sessionId);

addMessage(sessionId, message);

clearMemory(sessionId);
```

This creates a clean abstraction.

---

# 11. Conversation Memory API

The application can expose higher-level functions:

```javascript
addUserMessage(sessionId, content);

addAssistantMessage(sessionId, content);

getConversationMessages(sessionId);
```

This keeps conversation-specific logic separate from storage logic.

---

# 12. Basic Memory Flow

The basic Day 59 flow is:

```text
User Message
      ↓
Save User Message
      ↓
Load Conversation History
      ↓
Send History + Current Message
      ↓
Groq LLM
      ↓
Assistant Response
      ↓
Save Assistant Response
      ↓
Return Response
```

---

# 13. Groq Integration

Day 59 uses Groq as the LLM provider.

Environment variables:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
MAX_MESSAGES=10
```

The API key must not be committed to Git.

Use `.env` locally and `.env.example` as a template.

---

# 14. Groq LLM Service

The LLM service should be responsible for communicating with Groq.

Conceptually:

```javascript
const response = await groq.chat.completions.create({
  model: MODEL,
  messages,
});
```

The rest of the application should not need to know how Groq is called.

Architecture:

```text
Agent
  ↓
LLM Service
  ↓
Groq API
```

---

# 15. Memory Window

Conversation history should not grow indefinitely.

Example:

```text
Message 1
Message 2
Message 3
...
Message 1000
```

Sending all messages can cause:

```text
Higher token usage
Higher cost
Higher latency
Large context
Irrelevant information
Context-window limitations
```

Therefore, memory should be managed.

---

# 16. Message Trimming

Day 59 uses a simple message limit.

Example:

```javascript
const MAX_MESSAGES = 10;
```

When messages exceed the limit:

```javascript
const trimmedMessages = messages.slice(-MAX_MESSAGES);
```

This keeps the latest messages.

Example:

```text
Before:

1
2
3
4
5
6
7
8
9
10
11
12

After:

3
4
5
6
7
8
9
10
11
12
```

---

# 17. Problem With Simple Trimming

Simple trimming can remove important information.

Example:

```text
Message 1:
My name is Shubham.

...

Message 50:
What is my name?
```

If message 1 is removed, the agent may no longer know the user's name.

Production systems can solve this with:

```text
Recent messages
+
Conversation summary
+
Long-term memory
+
Relevant retrieval
```

---

# 18. Conversation Summary

Instead of storing every old message forever, older messages can be summarized.

Example:

```text
Original:

My name is Shubham.
I am a JavaScript developer.
I work with Node.js.
I am learning Generative AI.
```

Summary:

```text
The user is Shubham, a JavaScript and
Node.js developer who is learning
Generative AI.
```

Then the model receives:

```text
Summary
+
Recent messages
+
Current user message
```

---

# 19. Memory Types

Important memory categories include:

## Short-Term Memory

Information required for the current interaction.

Example:

```text
The previous calculation result is 1000.
```

---

## Conversation Memory

Previous messages in a conversation.

Example:

```text
User:
My name is Shubham.

Assistant:
Nice to meet you, Shubham.
```

---

## Persistent Memory

Information retained beyond the current session.

Examples:

```text
User preferences
User profile
Long-term preferences
Previous important interactions
```

---

## Summarized Memory

Compressed representation of older conversation history.

Example:

```text
User is a Node.js developer learning Generative AI.
```

---

# 20. Memory vs RAG

Memory and RAG are not the same.

## Memory

Usually contains information about:

```text
User
Conversation
Agent state
Past interactions
Preferences
```

Example:

```text
User prefers JavaScript.
```

---

## RAG

Retrieves external information from a knowledge source.

Examples:

```text
PDFs
Documents
Knowledge bases
Databases
Vector stores
Documentation
```

Example:

```text
Express documentation says...
```

---

# 21. Memory + RAG

Both can be used together.

```text
                 Agent
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Memory       RAG       Tools
        │          │          │
        ▼          ▼          ▼
     User data  Knowledge   APIs
```

The LLM can use all relevant information to produce the final response.

---

# 22. Agent State

Agent state is broader than conversation memory.

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

# 23. Agent State Lifecycle

A simple agent workflow can be represented as:

```text
START
  ↓
THINK
  ↓
TOOL_CALL
  ↓
OBSERVE
  ↓
THINK
  ↓
FINAL
```

State can change:

```text
running
   ↓
tool_call
   ↓
observing
   ↓
running
   ↓
completed
```

---

# 24. Memory + Tool Calling

Day 58 focused on tool calling.

Day 59 adds memory.

Combined architecture:

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

Example:

```text
User:
My name is Shubham.

Agent:
Nice to meet you, Shubham.

User:
Calculate 25 * 40.

Agent:
1000.

User:
What is my name?

Agent:
Your name is Shubham.
```

The calculator tool handles the calculation while memory handles the user's name.

---

# 25. Memory Lifecycle

A production memory system may follow:

```text
Create
 ↓
Read
 ↓
Update
 ↓
Trim
 ↓
Summarize
 ↓
Persist
 ↓
Expire
 ↓
Delete
```

---

# 26. Session Expiration

Sessions should not necessarily remain forever.

Example:

```text
Session created
       ↓
User activity
       ↓
No activity
       ↓
30 minutes
       ↓
Session expires
```

Redis TTL is useful for this kind of behavior.

---

# 27. Storage Abstraction

The application should depend on an interface rather than a specific storage implementation.

Current:

```text
MapMemoryStore
```

Future:

```text
RedisMemoryStore
DatabaseMemoryStore
```

Architecture:

```text
Agent
 ↓
Memory Manager
 ↓
Memory Store Interface
 ↓
┌──────────────────────┐
│ Map                  │
│ Redis                │
│ Database             │
└──────────────────────┘
```

---

# 28. Production Security

Never blindly trust a client-provided session ID.

Bad architecture:

```text
Client
 ↓
sessionId
 ↓
Memory
```

A malicious user could potentially attempt to access another session.

Better:

```text
Authenticated User
       +
Authorized Session
       ↓
Memory
```

The server should verify that the authenticated user owns the requested session.

---

# 29. Day 59 Architecture

```text
                       Client
                          │
                          ▼
                     Express API
                          │
                          ▼
                    Authentication
                          │
                          ▼
                       Session
                          │
                          ▼
                    Memory Manager
                          │
                  ┌───────┴───────┐
                  ▼               ▼
            Recent Messages    Summary
                  │               │
                  └───────┬───────┘
                          ▼
                        Agent
                          │
                 ┌────────┼────────┐
                 ▼        ▼        ▼
                Groq     Tools     RAG
                 │        │
                 └────────┼────────┘
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

# 30. Day 59 Key Learnings

I learned:

- Stateless vs stateful agents
- Conversation state
- Session IDs
- Conversation history
- Memory stores
- Memory managers
- Short-term memory
- Persistent memory concepts
- Memory trimming
- Context-window limitations
- Token and cost considerations
- Session isolation
- Agent state
- Memory + tool calling
- Memory vs RAG
- Storage abstraction
- Production memory architecture

---

# 31. Day 59 Summary

A conversational agent is not simply:

```text
User → LLM → Response
```

A stateful agent is:

```text
User
 ↓
Session
 ↓
Memory
 ↓
Agent
 ↓
LLM + Tools + RAG
 ↓
Agent State
 ↓
Memory Update
 ↓
Response
```

The key principle is:

> Store only the information that is useful, retrieve it when needed, and isolate it correctly for each user and session.
