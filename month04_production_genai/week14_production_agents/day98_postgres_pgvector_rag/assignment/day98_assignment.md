# Day 98 Assignment

## Level 1 — Database

1. Start PostgreSQL + pgvector.
2. Run the migration.
3. Verify documents and document_chunks tables.
4. Verify tenant_id indexes.
5. Verify unique(document_id, chunk_index).

## Level 2 — Repository

Implement and understand:

DocumentRepository:
- create
- findById
- listByTenant
- updateStatus
- incrementRetry
- delete

VectorRepository:
- insertChunk
- insertMany
- search
- deleteByDocumentId

## Level 3 — Production Knowledge Base

Test:

POST /api/documents
GET /api/documents
GET /api/documents/:id
DELETE /api/documents/:id
POST /api/chat
GET /api/health

Use x-tenant-id to simulate tenant authentication.

## Scenario questions

1. How is tenant isolation enforced?
2. Why is ingestion asynchronous?
3. Why is document status needed?
4. How does retry work?
5. How are duplicate chunks prevented?
6. Why do we delete old chunks before re-indexing?
7. Why is the vector dimension 384?
8. Why is Groq used for generation instead of embeddings?
9. Why should a weak Top-K result be rejected?
10. What would you change before production?

## Production improvements

- Replace x-tenant-id with real authentication/JWT.
- Replace in-memory queue with BullMQ/SQS/RabbitMQ/Kafka.
- Add real file storage.
- Add PDF/DOCX extraction.
- Add batch embedding.
- Add transactional ingestion state management.
- Add dead-letter queue.
- Add metrics/tracing.
- Benchmark HNSW/IVFFlat indexes.
- Add automated retrieval evaluation.
