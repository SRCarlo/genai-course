export function recallAtK(retrievedIds, relevantIds, k = 5) {
  if (!relevantIds.length) return 1;

  const topK = new Set(retrievedIds.slice(0, k));
  const hits = relevantIds.filter((id) => topK.has(id)).length;

  return hits / relevantIds.length;
}

export function precisionAtK(retrievedIds, relevantIds, k = 5) {
  const topK = retrievedIds.slice(0, k);
  if (!topK.length) return 0;

  const relevant = new Set(relevantIds);
  const hits = topK.filter((id) => relevant.has(id)).length;

  return hits / topK.length;
}

export function reciprocalRank(retrievedIds, relevantIds) {
  const relevant = new Set(relevantIds);

  for (let i = 0; i < retrievedIds.length; i += 1) {
    if (relevant.has(retrievedIds[i])) {
      return 1 / (i + 1);
    }
  }

  return 0;
}

export function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
