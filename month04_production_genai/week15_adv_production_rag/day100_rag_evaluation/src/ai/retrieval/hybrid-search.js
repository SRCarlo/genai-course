import { vectorSearch } from "./vector-search.js";
import { keywordSearch } from "./keyword-search.js";

function reciprocalRank(rank, k = 60) {
  return 1 / (k + rank);
}

export function rrf(vectorResults, keywordResults, topK = 5) {
  const byId = new Map();

  vectorResults.forEach((doc, index) => {
    const current = byId.get(doc.id) ?? {
      ...doc,
      rrfScore: 0,
      sources: [],
    };
    current.rrfScore += reciprocalRank(index + 1);
    current.sources.push("vector");
    byId.set(doc.id, current);
  });

  keywordResults.forEach((doc, index) => {
    const current = byId.get(doc.id) ?? {
      ...doc,
      rrfScore: 0,
      sources: [],
    };
    current.rrfScore += reciprocalRank(index + 1);
    current.sources.push("keyword");
    byId.set(doc.id, current);
  });

  return [...byId.values()]
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, topK);
}

export function hybridSearch(query, documents, topK = 5) {
  const vectorResults = vectorSearch(query, documents, topK);
  const keywordResults = keywordSearch(query, documents, topK);
  const results = rrf(vectorResults, keywordResults, topK);

  return {
    results,
    vectorResults,
    keywordResults,
  };
}
