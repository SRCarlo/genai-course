export function normalizeRetrievedSources(retrieved = []) {
  return retrieved
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      return (
        item.source ??
        item.metadata?.source ??
        item.fileName ??
        item.filename ??
        null
      );
    })
    .filter(Boolean);
}

export function evaluateRetrieval(retrieved = [], expectedSource) {
  const sources = normalizeRetrievedSources(retrieved);

  if (!expectedSource) {
    return {
      precision: 1,
      recall: 1,
      reciprocalRank: 1,
      retrievedSources: sources,
      expectedSource: null,
    };
  }

  const relevantCount = sources.filter(
    (source) => source === expectedSource,
  ).length;

  const precision = sources.length === 0 ? 0 : relevantCount / sources.length;

  const recall = sources.includes(expectedSource) ? 1 : 0;

  const rank = sources.indexOf(expectedSource);

  const reciprocalRank = rank === -1 ? 0 : 1 / (rank + 1);

  return {
    precision,
    recall,
    reciprocalRank,
    retrievedSources: sources,
    expectedSource,
  };
}

export function evaluateTopK(retrieved = [], expectedSource) {
  const sources = normalizeRetrievedSources(retrieved);

  const top1 = sources.slice(0, 1).includes(expectedSource) ? 1 : 0;

  const top3 = sources.slice(0, 3).includes(expectedSource) ? 1 : 0;

  const top5 = sources.slice(0, 5).includes(expectedSource) ? 1 : 0;

  return {
    top1,
    top3,
    top5,
  };
}
