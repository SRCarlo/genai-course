CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED')),
    mime_type TEXT,
    content TEXT,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(384) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_document_chunk UNIQUE (document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_documents_tenant
ON documents(tenant_id);

CREATE INDEX IF NOT EXISTS idx_documents_status
ON documents(status);

CREATE INDEX IF NOT EXISTS idx_document_chunks_tenant
ON document_chunks(tenant_id);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document
ON document_chunks(document_id);

CREATE INDEX IF NOT EXISTS idx_document_chunks_created
ON document_chunks(created_at);

-- Add an ANN index after you have enough vector data to benchmark.
-- Example for cosine distance:
-- CREATE INDEX idx_document_chunks_embedding_hnsw
-- ON document_chunks
-- USING hnsw (embedding vector_cosine_ops);
