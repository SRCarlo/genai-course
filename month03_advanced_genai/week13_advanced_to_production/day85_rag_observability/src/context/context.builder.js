export class ContextBuilder {
  build(results) {
    const chunks = results.map(
      (result, index) => ({
        index: index + 1,
        documentId: result.id,
        title: result.title,
        content: result.content.trim(),
        score: result.rerankScore
      })
    );

    const text = chunks
      .map(
        (chunk) =>
          `[Source ${chunk.index}: ${chunk.documentId}]\n${chunk.content}`
      )
      .join("\n\n");

    return {
      chunks,
      text,
      tokenCount: text
        .split(/\s+/)
        .filter(Boolean).length
    };
  }
}