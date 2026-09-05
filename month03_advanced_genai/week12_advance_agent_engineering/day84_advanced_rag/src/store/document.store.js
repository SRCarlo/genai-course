const documents = [];

export function clearStore() {
  documents.length = 0;
}

export function addDocuments(items) {
  documents.push(...items);
}

export function getDocuments() {
  return [...documents];
}

export function getDocumentById(id) {
  return documents.find((doc) => doc.id === id);
}

export function getDocumentCount() {
  return documents.length;
}
