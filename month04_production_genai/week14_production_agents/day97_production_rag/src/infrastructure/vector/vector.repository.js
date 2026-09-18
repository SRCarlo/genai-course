function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error("VECTOR_DIMENSION_MISMATCH");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];

    magnitudeA += a[i] * a[i];

    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export class VectorRepository {
  constructor() {
    this.records = [];
  }

  async upsert(records) {
    for (const record of records) {
      const existingIndex = this.records.findIndex(
        (item) => item.id === record.id,
      );

      if (existingIndex >= 0) {
        this.records[existingIndex] = record;
      } else {
        this.records.push(record);
      }
    }

    return records;
  }

  async search(vector, options = {}) {
    const { topK = 5, filter = {}, threshold = 0 } = options;

    let candidates = [...this.records];

    if (filter.tenantId) {
      candidates = candidates.filter(
        (record) => record.metadata?.tenantId === filter.tenantId,
      );
    }

    if (filter.documentId) {
      candidates = candidates.filter(
        (record) => record.documentId === filter.documentId,
      );
    }

    const results = candidates
      .map((record) => ({
        ...record,
        score: cosineSimilarity(vector, record.embedding),
      }))
      .filter((record) => record.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  async deleteByDocumentId(documentId) {
    this.records = this.records.filter(
      (record) => record.documentId !== documentId,
    );
  }
}
