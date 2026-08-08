import { vectorSearch } from "./vectorSearchService.js";
import { keywordSearch } from "./keywordSearchService.js";

export async function hybridSearch(query) {
  const [vectorResults, keywordResults] = await Promise.all([
    vectorSearch(query),
    keywordSearch(query),
  ]);

  const merged = new Map();

  for (const doc of vectorResults) {
    merged.set(doc.id, {
      ...doc,
      vectorRank: vectorResults.indexOf(doc) + 1,
      keywordRank: null,
    });
  }

  for (const doc of keywordResults) {
    if (merged.has(doc.id)) {
      merged.set(doc.id, {
        ...merged.get(doc.id),
        keywordRank: keywordResults.indexOf(doc) + 1,
        keywordScore: doc.keywordScore,
      });
    } else {
      merged.set(doc.id, {
        ...doc,
        vectorRank: null,
        keywordRank: keywordResults.indexOf(doc) + 1,
      });
    }
  }

  const k = 60;

  const results = Array.from(merged.values())
    .map((doc) => {
      const vectorContribution = doc.vectorRank ? 1 / (k + doc.vectorRank) : 0;

      const keywordContribution = doc.keywordRank
        ? 1 / (k + doc.keywordRank)
        : 0;

      return {
        ...doc,
        hybridScore: vectorContribution + keywordContribution,
      };
    })
    .sort((a, b) => b.hybridScore - a.hybridScore);

  return results;
}
