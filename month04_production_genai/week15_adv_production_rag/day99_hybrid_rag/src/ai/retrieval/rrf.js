export function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map();
  const documents = new Map();
  for (const results of resultLists) {
    results.forEach((result, index) => {
      const rank = index + 1;
      const score = 1 / (k + rank);
      const id = result.id;
      scores.set(id, (scores.get(id) || 0) + score);
      documents.set(id, result);
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ ...documents.get(id), fusionScore: score }));
}
