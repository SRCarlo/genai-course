import cosineSimilarity from "./cosineSimilarity.js";

export function retrieve(documents, queryEmbedding) {
  return documents.map((doc) => {
    return {
      ...doc,

      vectorScore: cosineSimilarity(doc.embedding, queryEmbedding),
    };
  });
}
