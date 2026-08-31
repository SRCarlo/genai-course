# DAY 79 ASSIGNMENT

## Basic

- Implement short-term memory.
- Implement memory store.
- Implement memory writer.
- Implement memory retrieval.
- Add memory types.
- Add memory importance.
- Build context manager.

## Intermediate

- Add conversation summarization.
- Add context limits.
- Add memory scoring.
- Add recency.
- Add memory updates.
- Add memory deletion.
- Add session memory.
- Add user memory.

## Advanced

- Add vector-based memory retrieval.
- Add semantic similarity.
- Add memory deduplication.
- Add contradictory-memory resolution.
- Add memory expiration.
- Add multi-tenant isolation.
- Add memory audit logs.
- Add memory evaluation.
- Connect memory to Day 78 agent.
- Connect memory + RAG + tools.

## Test Cases

### Test 1

Input:

"My project uses PostgreSQL."

Expected:

Memory candidate detected.

### Test 2

Input:

"What database am I using?"

Expected:

PostgreSQL memory retrieved.

### Test 3

Input:

"Forget that I use PostgreSQL."

Expected:

Memory deleted or updated.

### Test 4

Create 30 messages.

Expected:

Older context is pruned or summarized.

### Test 5

User A:

"I use PostgreSQL."

User B:

"I use MongoDB."

Ask both:

"What database do I use?"

Expected:

User A → PostgreSQL

User B → MongoDB
