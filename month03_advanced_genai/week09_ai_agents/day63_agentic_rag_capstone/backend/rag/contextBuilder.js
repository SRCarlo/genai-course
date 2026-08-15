export function buildContext(results) {
  if (!results || results.length === 0) {
    return "No relevant company knowledge was retrieved.";
  }

  return results
    .map(
      (result, index) => `
SOURCE ${index + 1}
FILE: ${result.source}
CHUNK: ${result.chunkId}
SCORE: ${result.score}

${result.content}
`,
    )
    .join("\n--------------------\n");
}
