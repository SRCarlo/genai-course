export function buildContext(documents) {
  return documents
    .map(
      (doc, index) => `SOURCE ${index + 1}
File: ${doc.source}

${doc.text}`,
    )
    .join("\n\n---------------------\n\n");
}
