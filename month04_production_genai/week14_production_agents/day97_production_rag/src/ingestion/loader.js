export async function loadDocument(content) {
  if (!content || typeof content !== "string") {
    throw new Error("DOCUMENT_EMPTY");
  }

  return content;
}
