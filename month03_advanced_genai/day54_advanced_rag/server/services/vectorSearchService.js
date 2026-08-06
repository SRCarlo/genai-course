import { loadDocuments } from "./documentLoader.js";

import { createVector, cosineSimilarity } from "./embeddingService.js";

export async function vectorSearch(query, topK = 5) {
  const queryVector = createVector(query);

  const documents = loadDocuments();

  const results = documents.map((doc) => {
    const docVector = createVector(doc.text);

    const score = cosineSimilarity(queryVector, docVector);

    return {
      ...doc,

      score,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}
