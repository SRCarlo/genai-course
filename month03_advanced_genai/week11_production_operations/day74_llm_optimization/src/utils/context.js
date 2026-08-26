export function filterDocuments(documents = [], query = "") {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  return documents.filter((document) => {
    const text = `${document.title} ${document.content}`.toLowerCase();

    return queryWords.some((word) => text.includes(word));
  });
}

export function limitDocuments(documents = [], limit = 5) {
  return documents.slice(0, limit);
}

export function compressContext(documents = [], maxCharacters = 8000) {
  let result = "";

  for (const document of documents) {
    const next = `${document.title}\n${document.content}\n\n`;

    if (result.length + next.length > maxCharacters) {
      break;
    }

    result += next;
  }

  return result.trim();
}

export function optimizeContext({
  documents = [],
  query,
  topK = 5,
  maxCharacters = 8000,
}) {
  const filtered = filterDocuments(documents, query);

  const limited = limitDocuments(filtered, topK);

  const compressed = compressContext(limited, maxCharacters);

  return {
    originalDocuments: documents.length,
    filteredDocuments: filtered.length,
    selectedDocuments: limited.length,
    context: compressed,
    originalCharacters: documents.reduce(
      (sum, document) => sum + document.content.length,
      0,
    ),
    finalCharacters: compressed.length,
  };
}
