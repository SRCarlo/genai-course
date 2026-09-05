import { vectorSearch } from "./vector.search.js";

import { keywordSearch } from "./keyword.search.js";

import { hybridScore } from "./hybrid.search.js";

import { filterByMetadata } from "./metadata.filter.js";

export function retrieve({
  query,
  documents,
  vocabulary,
  filters = {},
  topK = 20,
}) {
  const filteredDocuments = filterByMetadata(documents, filters);

  const semanticResults = vectorSearch(
    query,
    filteredDocuments,
    vocabulary,
    topK,
  );

  const keywordResults = keywordSearch(query, filteredDocuments, topK);

  const resultMap = new Map();

  for (const document of semanticResults) {
    resultMap.set(document.id, {
      ...document,
      semanticScore: document.semanticScore,
      keywordScore: 0,
    });
  }

  for (const document of keywordResults) {
    const existing = resultMap.get(document.id);

    if (existing) {
      existing.keywordScore = document.keywordScore;
    } else {
      resultMap.set(document.id, {
        ...document,
        semanticScore: 0,
        keywordScore: document.keywordScore,
      });
    }
  }

  return [...resultMap.values()]
    .map((document) => ({
      ...document,
      hybridScore: hybridScore(document.semanticScore, document.keywordScore),
    }))
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, topK);
}
