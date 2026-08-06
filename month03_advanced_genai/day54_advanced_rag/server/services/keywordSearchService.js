import { loadDocuments } from "./documentLoader.js";

import { tokenize } from "./embeddingService.js";

export async function keywordSearch(query, topK = 5) {
  const queryWords = tokenize(query);

  const documents = loadDocuments();

  const results = documents.map((doc) => {
    const words = tokenize(doc.text);

    let score = 0;

    queryWords.forEach((word) => {
      score += words.filter((w) => w === word).length;
    });

    return {
      ...doc,

      keywordScore: score,
    };
  });

  results.sort((a, b) => b.keywordScore - a.keywordScore);

  return results.slice(0, topK);
}
