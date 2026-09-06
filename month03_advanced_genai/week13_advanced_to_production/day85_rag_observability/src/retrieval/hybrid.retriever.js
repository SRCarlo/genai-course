export class HybridRetriever {
  constructor({
    vectorRetriever,
    keywordRetriever
  }) {
    this.vectorRetriever = vectorRetriever;
    this.keywordRetriever = keywordRetriever;
  }

  normalize(results) {
    if (results.length === 0) {
      return [];
    }

    const maxScore = Math.max(
      ...results.map((item) => item.score)
    );

    if (maxScore === 0) {
      return results.map((item) => ({
        ...item,
        normalizedScore: 0
      }));
    }

    return results.map((item) => ({
      ...item,
      normalizedScore:
        item.score / maxScore
    }));
  }

  search(query, limit = 10) {
    const vectorResults =
      this.vectorRetriever.search(
        query,
        limit
      );

    const keywordResults =
      this.keywordRetriever.search(
        query,
        limit
      );

    const normalizedVector =
      this.normalize(vectorResults);

    const normalizedKeyword =
      this.normalize(keywordResults);

    const merged = new Map();

    for (const result of normalizedVector) {
      merged.set(result.id, {
        ...result,
        vectorScore:
          result.normalizedScore,
        keywordScore: 0
      });
    }

    for (const result of normalizedKeyword) {
      const existing =
        merged.get(result.id);

      if (existing) {
        existing.keywordScore =
          result.normalizedScore;
      } else {
        merged.set(result.id, {
          ...result,
          vectorScore: 0,
          keywordScore:
            result.normalizedScore
        });
      }
    }

    return [...merged.values()]
      .map((result) => ({
        ...result,
        hybridScore:
          result.vectorScore * 0.6 +
          result.keywordScore * 0.4,
        retrievalMethod: "hybrid"
      }))
      .sort(
        (a, b) =>
          b.hybridScore - a.hybridScore
      )
      .slice(0, limit);
  }
}