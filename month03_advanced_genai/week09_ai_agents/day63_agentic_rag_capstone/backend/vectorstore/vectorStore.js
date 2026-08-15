import { embedText, cosineSimilarity } from "../embeddings/embeddingService.js";

const documents = [];

export function clearVectorStore() {
  documents.length = 0;
}

export function addDocuments(items) {
  for (const item of items) {
    documents.push({
      ...item,
      embedding: embedText(item.content),
    });
  }
}

export function similaritySearch(query, topK = 5) {
  if (!query) {
    return [];
  }

  const queryEmbedding = embedText(query);

  return documents
    .map((document) => ({
      ...document,
      score: cosineSimilarity(queryEmbedding, document.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function getVectorStoreSize() {
  return documents.length;
}
