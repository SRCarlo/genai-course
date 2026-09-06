import { tokenize } from "./tokenizer.js";

export class Reranker {
  rerank(query, results, limit = 5) {
    const queryTokens = new Set(
      tokenize(query)
    );

    const reranked = results.map((result) => {
      const contentTokens = new Set(
        tokenize(
          `${result.title} ${result.content}`
        )
      );

      let overlap = 0;

      for (const token of queryTokens) {
        if (contentTokens.has(token)) {
          overlap += 1;
        }
      }

      const overlapRatio =
        queryTokens.size === 0
          ? 0
          : overlap / queryTokens.size;

      const rerankScore =
        result.hybridScore * 0.7 +
        overlapRatio * 0.3;

      return {
        ...result,
        overlapRatio,
        rerankScore
      };
    });

    return reranked
      .sort(
        (a, b) =>
          b.rerankScore - a.rerankScore
      )
      .slice(0, limit);
  }
}