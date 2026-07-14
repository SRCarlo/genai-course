const vectorStore = [];

export function addDocument(document, embedding) {
  vectorStore.push({
    document,
    embedding,
  });
}

export function getDocuments() {
  return vectorStore;
}
