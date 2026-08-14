import { createEmbedding } from "../embeddings/embeddingService.js";

import { search } from "../vectorstore/vectorStore.js";

const DEFAULT_TOP_K = Number(process.env.TOP_K || 5);

const MIN_SIMILARITY = Number(process.env.MIN_SIMILARITY || 0.35);

export async function retrieveDocuments(query, topK = DEFAULT_TOP_K) {
  if (!query || !query.trim()) {
    throw new Error("Retrieval query is required");
  }

  const embedding = await createEmbedding(query);

  const results = await search(embedding, topK);

  const filtered = results.filter((item) => item.score >= MIN_SIMILARITY);

  return filtered;
}

export { MIN_SIMILARITY };
