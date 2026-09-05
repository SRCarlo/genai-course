function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function lexicalRerankScore(query, content) {
  const queryWords = new Set(tokenize(query));

  const documentWords = tokenize(content);

  if (!queryWords.size) {
    return 0;
  }

  let matches = 0;

  for (const word of documentWords) {
    if (queryWords.has(word)) {
      matches++;
    }
  }

  return Math.min(matches / queryWords.size, 1);
}

export function rerank(query, documents, topK = 5) {
  return documents
    .map((document) => {
      const lexicalScore = lexicalRerankScore(query, document.content);

      const rerankScore = document.hybridScore * 0.5 + lexicalScore * 0.5;

      return {
        ...document,
        rerankScore,
      };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, topK);
}
