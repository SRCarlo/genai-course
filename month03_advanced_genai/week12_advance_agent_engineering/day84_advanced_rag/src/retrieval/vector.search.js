import {
  embedText,
  cosineSimilarity,
} from "../embeddings/embedding.service.js";

export function vectorSearch(query, documents, vocabulary, topK = 20) {
  const queryEmbedding = embedText(query, vocabulary);

  return documents
    .map((document) => ({
      ...document,
      semanticScore: cosineSimilarity(queryEmbedding, document.embedding),
    }))
    .sort((a, b) => b.semanticScore - a.semanticScore)
    .slice(0, topK);
}
