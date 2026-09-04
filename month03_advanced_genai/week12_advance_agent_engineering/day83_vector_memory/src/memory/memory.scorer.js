export function calculateRecencyScore(createdAt, halfLifeDays = 30) {
  const created = new Date(createdAt).getTime();

  const now = Date.now();

  const ageMs = Math.max(0, now - created);

  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  return Math.exp((-Math.log(2) * ageDays) / halfLifeDays);
}

export function calculateKeywordScore(query, content) {
  const queryWords = tokenize(query);

  const contentWords = new Set(tokenize(content));

  if (!queryWords.length) {
    return 0;
  }

  let matches = 0;

  for (const word of queryWords) {
    if (contentWords.has(word)) {
      matches++;
    }
  }

  return matches / queryWords.length;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function calculateFinalScore({
  semanticSimilarity,
  importance,
  recency,
  keywordMatch,
}) {
  return (
    0.6 * semanticSimilarity +
    0.2 * importance +
    0.1 * recency +
    0.1 * keywordMatch
  );
}
