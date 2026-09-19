import { pool } from "../database/db.js";

export class DocumentRepository {
  async create(document) {
    const query = `
      INSERT INTO documents (
        id, tenant_id, name, status, mime_type, content
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      document.id,
      document.tenantId,
      document.name,
      document.status,
      document.mimeType ?? null,
      document.content ?? null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findById(id, tenantId) {
    const query = `
      SELECT *
      FROM documents
      WHERE id = $1
        AND tenant_id = $2
        AND status <> 'DELETED';
    `;

    const result = await pool.query(query, [id, tenantId]);
    return result.rows[0] ?? null;
  }

  async listByTenant(tenantId) {
    const result = await pool.query(
      `SELECT id, tenant_id, name, status, mime_type, retry_count,
              error_message, created_at, updated_at
       FROM documents
       WHERE tenant_id = $1 AND status <> 'DELETED'
       ORDER BY created_at DESC`,
      [tenantId]
    );
    return result.rows;
  }

  async updateStatus(id, tenantId, status, errorMessage = null) {
    const result = await pool.query(
      `UPDATE documents
       SET status = $1,
           error_message = $2,
           updated_at = NOW()
       WHERE id = $3 AND tenant_id = $4
       RETURNING *`,
      [status, errorMessage, id, tenantId]
    );
    return result.rows[0] ?? null;
  }

  async incrementRetry(id, tenantId) {
    const result = await pool.query(
      `UPDATE documents
       SET retry_count = retry_count + 1,
           updated_at = NOW()
       WHERE id = $1 AND tenant_id = $2
       RETURNING retry_count`,
      [id, tenantId]
    );
    return result.rows[0]?.retry_count ?? 0;
  }

  async delete(id, tenantId) {
    const result = await pool.query(
      `UPDATE documents
       SET status = 'DELETED', updated_at = NOW()
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [id, tenantId]
    );
    return result.rows[0] ?? null;
  }
}
