export function calculateRecencyScore(createdAt) {
  const created = new Date(createdAt).getTime();

  const now = Date.now();

  const ageInDays = (now - created) / (1000 * 60 * 60 * 24);

  const decayRate = 0.05;

  return Math.exp(-decayRate * ageInDays);
}

export function scoreMemory(memory, relevance = 0) {
  const recency = calculateRecencyScore(memory.createdAt);

  return relevance * 0.6 + memory.importance * 0.2 + recency * 0.2;
}

export function scoreAndSortMemories(memories, relevanceMap = new Map()) {
  return memories
    .map((memory) => {
      const relevance = relevanceMap.get(memory.id) || 0;

      return {
        ...memory,
        score: scoreMemory(memory, relevance),
      };
    })
    .sort((a, b) => b.score - a.score);
}
