export function filterByRelevance(results, threshold = 0) {
  return results.filter(
    (result) =>
      (result.rerankScore ??
        result.fusionScore ??
        result.vectorScore ??
        result.keywordScore ??
        0) >= threshold,
  );
}
