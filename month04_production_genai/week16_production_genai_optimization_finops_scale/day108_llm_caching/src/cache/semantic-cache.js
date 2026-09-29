function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function createVector(text) {
  const frequencies = {};

  for (const token of tokenize(text)) {
    frequencies[token] = (frequencies[token] || 0) + 1;
  }

  return frequencies;
}

function cosineSimilarity(vectorA, vectorB) {
  const keys = new Set([
    ...Object.keys(vectorA),
    ...Object.keys(vectorB)
  ]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const key of keys) {
    const a = vectorA[key] || 0;
    const b = vectorB[key] || 0;

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}

export class SemanticCache {
  constructor({ threshold = 0.7, ttlMs = 300_000 } = {}) {
    this.entries = [];
    this.threshold = threshold;
    this.ttlMs = ttlMs;
  }

  createEmbedding(query) {
    return createVector(query);
  }

  similarity(queryA, queryB) {
    return cosineSimilarity(
      this.createEmbedding(queryA),
      this.createEmbedding(queryB)
    );
  }

  set({ query, response, tenantId, contextVersion, ttlMs = this.ttlMs }) {
    this.entries.push({
      query,
      embedding: this.createEmbedding(query),
      response,
      tenantId,
      contextVersion,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlMs
    });
  }

  get({ query, tenantId, contextVersion, threshold = this.threshold }) {
    const queryEmbedding = this.createEmbedding(query);
    let bestMatch = null;

    for (const entry of this.entries) {
      if (entry.expiresAt <= Date.now()) continue;
      if (entry.tenantId !== tenantId) continue;
      if (entry.contextVersion !== contextVersion) continue;

      const similarity = cosineSimilarity(
        queryEmbedding,
        entry.embedding
      );

      if (
        similarity >= threshold &&
        (!bestMatch || similarity > bestMatch.similarity)
      ) {
        bestMatch = { ...entry, similarity };
      }
    }

    return bestMatch;
  }

  deleteExpired() {
    const before = this.entries.length;

    this.entries = this.entries.filter(
      entry => entry.expiresAt > Date.now()
    );

    return before - this.entries.length;
  }

  clear() {
    this.entries = [];
  }

  size() {
    return this.entries.length;
  }
}