export function rerankDocuments(query, documents) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  return [...documents]
    .map((document) => {
      let relevance = document.score || 0;

      for (const word of queryWords) {
        if (document.title.toLowerCase().includes(word)) {
          relevance += 2;
        }
      }

      return {
        ...document,
        relevance,
      };
    })
    .sort((a, b) => b.relevance - a.relevance);
}
