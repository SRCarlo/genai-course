# DAY 79 — AGENT MEMORY & CONTEXT MANAGEMENT

## Core Idea

Good agent memory does not mean remembering everything.

It means:

Store selectively
↓
Retrieve intelligently
↓
Build relevant context
↓
Control context size
↓
Generate response
↓
Update memory

## Memory Types

### Short-Term Memory

Current conversation.

Implementation:

Sliding window.

### Working Memory

Information currently needed
to complete a task.

### Long-Term Memory

Information useful across sessions.

Includes:

- Semantic memory
- Episodic memory
- Preference memory
- Project memory

## Semantic Memory

Facts.

Example:

User uses PostgreSQL.

## Episodic Memory

Past events.

Example:

User deployed an API yesterday.

## Preference Memory

Stable user preferences.

Example:

User prefers REST APIs.

## Memory Store

Operations:

- save
- get
- search
- update
- delete
- deleteByUser

## Memory Retrieval

Retrieve only relevant memories.

Do not send all memories to the LLM.

## Memory Scoring

Score can combine:

- relevance
- importance
- recency

## Context Management

Final context can contain:

- system instructions
- long-term memories
- conversation summary
- working state
- recent messages
- current user request

## Context Overflow

Use:

- sliding window
- summarization
- pruning
- truncation
- relevance filtering

## Memory Lifecycle

Conversation
↓
Candidate
↓
Importance check
↓
Store
↓
Retrieve
↓
Use
↓
Update
↓
Expire/Delete

## User Isolation

Memory must be scoped by:

- tenantId
- userId
- sessionId

## Memory vs RAG

RAG:

External knowledge.

Memory:

User/task-specific knowledge.

## Production Architecture

USER
↓
AGENT
↓
MEMORY RETRIEVAL
↓
RAG RETRIEVAL
↓
CONTEXT BUILDER
↓
LLM
↓
TOOLS
↓
OBSERVATION
↓
STATE UPDATE
↓
MEMORY WRITER
↓
MEMORY STORE

## Main Lesson

Good agent memory is:

"Retrieve the right information
at the right time."

Not:

"Remember everything."
