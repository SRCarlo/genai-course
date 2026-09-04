import { cosineSimilarity } from "./vector.similarity.js";

import {
  calculateRecencyScore,
  calculateKeywordScore,
  calculateFinalScore,
} from "./memory.scorer.js";

export class SemanticRetriever {
  constructor(embeddingService, vectorStore) {
    this.embeddingService = embeddingService;

    this.vectorStore = vectorStore;
  }

  async search(userId, query, options = {}) {
    const {
      topK = 5,
      type,
      minSimilarity = -1,
      minImportance = 0,
      hybrid = true,
    } = options;

    if (!userId) {
      throw new Error("userId is required");
    }

    if (!query) {
      throw new Error("query is required");
    }

    const queryEmbedding = await this.embeddingService.embed(query);

    let memories = this.vectorStore
      .getAll()
      .filter((memory) => memory.userId === userId);

    if (type) {
      memories = memories.filter((memory) => memory.type === type);
    }

    memories = memories.filter((memory) => memory.importance >= minImportance);

    const scored = memories.map((memory) => {
      const semanticSimilarity = cosineSimilarity(
        queryEmbedding,
        memory.embedding,
      );

      const recency = calculateRecencyScore(memory.createdAt);

      const keywordMatch = calculateKeywordScore(query, memory.content);

      const finalScore = hybrid
        ? calculateFinalScore({
            semanticSimilarity,
            importance: memory.importance,
            recency,
            keywordMatch,
          })
        : semanticSimilarity;

      return {
        ...memory,
        score: finalScore,
        semanticSimilarity,
        recency,
        keywordMatch,
      };
    });

    return scored
      .filter((memory) => memory.semanticSimilarity >= minSimilarity)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
