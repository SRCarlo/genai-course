export class MemoryRetriever {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  search(userId, query, limit = 5) {
    const memories = this.memoryStore.get(userId);

    if (!memories.length) {
      return [];
    }

    const queryWords = this.tokenize(query);

    const scoredMemories = memories
      .map((memory) => {
        const contentWords = this.tokenize(memory.content);

        let score = 0;

        for (const word of queryWords) {
          if (contentWords.includes(word)) {
            score++;
          }
        }

        // Importance is used as a small ranking boost.
        score += (memory.importance || 0) * 0.1;

        return {
          memory,
          score,
        };
      })
      .filter((item) => item.score > 0);

    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.memory);
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s.-]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  }
}
