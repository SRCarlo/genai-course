export function buildContext(results) {
  return results
    .map((result, index) => {
      const metadata = result.metadata
        ? JSON.stringify(result.metadata)
        : "{}";

      return [
        `[Source ${index + 1}]`,
        `documentId: ${result.document_id}`,
        `distance: ${Number(result.distance).toFixed(4)}`,
        `metadata: ${metadata}`,
        `content: ${result.content}`
      ].join("\n");
    })
    .join("\n\n");
}
