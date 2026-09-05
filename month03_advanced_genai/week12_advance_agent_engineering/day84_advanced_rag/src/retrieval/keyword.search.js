function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function keywordScore(query, content) {
  const queryTokens = tokenize(query);
  const contentTokens = tokenize(content);

  if (!queryTokens.length) {
    return 0;
  }

  const contentSet = new Set(contentTokens);

  let matches = 0;

  for (const token of queryTokens) {
    if (contentSet.has(token)) {
      matches++;
    }
  }

  return matches / queryTokens.length;
}

export function keywordSearch(query, documents, topK = 20) {
  return documents
    .map((document) => ({
      ...document,
      keywordScore: keywordScore(query, document.content),
    }))
    .filter((document) => document.keywordScore > 0)
    .sort((a, b) => b.keywordScore - a.keywordScore)
    .slice(0, topK);
}
