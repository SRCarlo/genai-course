import { tokenize } from "./embeddingService.js";

export function rerank(query, documents) {
  const queryWords = tokenize(query);

  return documents
    .map((doc) => {
      const docWords = tokenize(doc.text);

      let coverage = 0;

      queryWords.forEach((word) => {
        if (docWords.includes(word)) coverage++;
      });

      return {
        ...doc,
        rerankScore: coverage + doc.hybridScore,
      };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, 3);
}
