export function buildSafeFallback(documents = []) {
  return {
    answer:
      "The AI service is temporarily unavailable. I can provide the retrieved reference information instead.",

    sources: documents.map((document) => ({
      documentId: document.documentId,

      title: document.title,
    })),
  };
}
