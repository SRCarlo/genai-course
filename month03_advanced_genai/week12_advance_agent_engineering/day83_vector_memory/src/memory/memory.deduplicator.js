import { cosineSimilarity } from "./vector.similarity.js";

export class MemoryDeduplicator {
  constructor(embeddingService, vectorStore, threshold = 0.92) {
    this.embeddingService = embeddingService;

    this.vectorStore = vectorStore;

    this.threshold = threshold;
  }

  async findDuplicate(memory) {
    const embedding = await this.embeddingService.embed(memory.content);

    const existing = this.vectorStore
      .getAll()
      .filter((item) => item.userId === memory.userId);

    let bestMatch = null;
    let bestScore = -1;

    for (const item of existing) {
      const score = cosineSimilarity(embedding, item.embedding);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore >= this.threshold) {
      return {
        duplicate: true,
        existing: bestMatch,
        score: bestScore,
      };
    }

    return {
      duplicate: false,
      existing: null,
      score: bestScore,
    };
  }
}
