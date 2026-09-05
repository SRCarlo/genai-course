export function hybridScore(
  semanticScore = 0,
  keywordScore = 0,
  semanticWeight = 0.6,
  keywordWeight = 0.4,
) {
  return semanticScore * semanticWeight + keywordScore * keywordWeight;
}

export function rankHybridResults(semanticResults, keywordResults) {
  const resultMap = new Map();

  for (const item of semanticResults) {
    resultMap.set(item.id, {
      ...item,
      semanticScore: item.semanticScore || 0,
      keywordScore: 0,
    });
  }

  for (const item of keywordResults) {
    const existing = resultMap.get(item.id);

    if (existing) {
      existing.keywordScore = item.keywordScore || 0;
    } else {
      resultMap.set(item.id, {
        ...item,
        semanticScore: 0,
        keywordScore: item.keywordScore || 0,
      });
    }
  }

  return [...resultMap.values()]
    .map((item) => ({
      ...item,
      hybridScore: hybridScore(item.semanticScore, item.keywordScore),
    }))
    .sort((a, b) => b.hybridScore - a.hybridScore);
}
