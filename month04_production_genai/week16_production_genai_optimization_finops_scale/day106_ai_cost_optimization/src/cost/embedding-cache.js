import crypto from "node:crypto";

export function hashDocument(text) {
  return crypto
    .createHash("sha256")
    .update(text, "utf8")
    .digest("hex");
}

export function createEmbeddingCache() {
  const cache = new Map();

  return {
    async getEmbedding(text, createEmbedding) {
      const key = hashDocument(text);

      if (cache.has(key)) {
        return {
          embedding: cache.get(key),
          cached: true,
          key
        };
      }

      const embedding = await createEmbedding(text);
      cache.set(key, embedding);

      return {
        embedding,
        cached: false,
        key
      };
    },

    has(text) {
      return cache.has(hashDocument(text));
    },

    size() {
      return cache.size;
    },

    clear() {
      cache.clear();
    }
  };
}