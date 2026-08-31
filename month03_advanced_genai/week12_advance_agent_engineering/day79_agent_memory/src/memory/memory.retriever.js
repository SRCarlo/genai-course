import { scoreAndSortMemories } from "./memory.scorer.js";

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function calculateKeywordRelevance(content, query) {
  const contentTokens = new Set(tokenize(content));

  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return 0;
  }

  let matches = 0;

  for (const token of queryTokens) {
    if (contentTokens.has(token)) {
      matches++;
    }
  }

  return matches / queryTokens.length;
}

export async function retrieveMemories(
  store,
  { userId, tenantId = "default", query, limit = 5 },
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const memories = await store.getAll(userId, tenantId);

  const now = Date.now();

  const activeMemories = memories.filter((memory) => {
    if (!memory.expiresAt) {
      return true;
    }

    return new Date(memory.expiresAt).getTime() > now;
  });

  const relevanceMap = new Map();

  for (const memory of activeMemories) {
    const relevance = calculateKeywordRelevance(memory.content, query);

    relevanceMap.set(memory.id, relevance);
  }

  const scored = scoreAndSortMemories(activeMemories, relevanceMap);

  return scored.filter((memory) => memory.score > 0).slice(0, limit);
}
