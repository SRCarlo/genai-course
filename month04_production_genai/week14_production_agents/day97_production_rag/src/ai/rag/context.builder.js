export function buildContext(results) {
  return results
    .map((result, index) => {
      return `
SOURCE ${index + 1}
Document: ${result.metadata?.source || "unknown"}
Page: ${result.metadata?.page || "N/A"}
Chunk: ${result.chunkIndex ?? "N/A"}

Content:
${result.content}
`;
    })
    .join("\n");
}
