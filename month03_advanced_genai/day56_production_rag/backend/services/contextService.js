export function buildContext(documents) {
  return documents
    .map(
      (doc, index) => `
SOURCE ${index + 1}
FILE: ${doc.source}
CATEGORY: ${doc.category || "general"}

${doc.text}
`,
    )
    .join("\n----------------\n");
}

export function extractSources(documents) {
  return documents.map((doc) => ({
    source: doc.source,
    category: doc.category || "general",
    chunkId: doc.id,
  }));
}
