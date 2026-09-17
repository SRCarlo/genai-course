export function buildContext(documents) {
  if (!documents.length) {
    return "";
  }

  return documents
    .map((document) => `Source: ${document.title}\n${document.content}`)
    .join("\n\n");
}
