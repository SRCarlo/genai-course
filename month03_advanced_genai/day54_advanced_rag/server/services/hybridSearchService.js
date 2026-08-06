import { vectorSearch } from "./vectorSearchService.js";

import { keywordSearch } from "./keywordSearchService.js";

export async function hybridSearch(query) {
  const vectorResults = await vectorSearch(query, 10);

  const keywordResults = await keywordSearch(query, 10);

  const merged = new Map();

  vectorResults.forEach((doc) => {
    merged.set(doc.id, {
      ...doc,

      hybridScore: doc.score,
    });
  });

  keywordResults.forEach((doc) => {
    if (merged.has(doc.id)) {
      merged.get(doc.id).hybridScore += doc.keywordScore;
    } else {
      merged.set(doc.id, {
        ...doc,

        hybridScore: doc.keywordScore,
      });
    }
  });

  return [...merged.values()]

    .sort((a, b) => b.hybridScore - a.hybridScore)

    .slice(0, 5);
}
