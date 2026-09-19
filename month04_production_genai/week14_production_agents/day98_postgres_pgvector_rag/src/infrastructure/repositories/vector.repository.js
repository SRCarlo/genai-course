import { pool } from "../database/db.js";

function vectorLiteral(vector) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("INVALID_VECTOR");
  }

  return `[${vector.map(Number).join(",")}]`;
}

export class VectorRepository {
  async insertChunk(chunk) {
    const query = `
      INSERT INTO document_chunks (
        id,
        document_id,
        tenant_id,
        chunk_index,
        content,
        embedding,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
      ON CONFLICT (document_id, chunk_index)
      DO UPDATE SET
        content = EXCLUDED.content,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata
      RETURNING id;
    `;

    const values = [
      chunk.id,
      chunk.documentId,
      chunk.tenantId,
      chunk.chunkIndex,
      chunk.content,
      vectorLiteral(chunk.embedding),
      JSON.stringify(chunk.metadata ?? {})
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async insertMany(chunks) {
    await pool.query("BEGIN");
    try {
      for (const chunk of chunks) {
        await this.insertChunk(chunk);
      }
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  async search({ queryVector, tenantId, topK = 5, maxDistance = 0.75 }) {
    const query = `
      SELECT
        id,
        document_id,
        content,
        metadata,
        embedding <=> $1::vector AS distance
      FROM document_chunks
      WHERE tenant_id = $2
        AND embedding <=> $1::vector <= $3
      ORDER BY embedding <=> $1::vector
      LIMIT $4;
    `;

    const result = await pool.query(query, [
      vectorLiteral(queryVector),
      tenantId,
      maxDistance,
      topK
    ]);

    return result.rows;
  }

  async deleteByDocumentId(documentId, tenantId) {
    await pool.query(
      `DELETE FROM document_chunks
       WHERE document_id = $1 AND tenant_id = $2`,
      [documentId, tenantId]
    );
  }
}
