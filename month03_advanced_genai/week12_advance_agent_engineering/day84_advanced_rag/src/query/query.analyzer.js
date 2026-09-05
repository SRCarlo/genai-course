export function analyzeQuery(query) {
  const normalized = query.trim().toLowerCase();

  const words = normalized.split(/\s+/).filter(Boolean);

  return {
    originalQuery: query,
    normalizedQuery: normalized,
    wordCount: words.length,
    hasQuestionMark: query.includes("?"),
    isShortQuery: words.length <= 3,
  };
}
