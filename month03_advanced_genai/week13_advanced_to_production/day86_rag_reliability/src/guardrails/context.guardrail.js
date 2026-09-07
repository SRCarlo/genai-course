const MAX_CHUNKS = Number(
  process.env.MAX_CONTEXT_CHUNKS || 5
);

const MAX_CHARS = Number(
  process.env.MAX_CONTEXT_CHARS || 12000
);

export function limitContext(
  chunks,
  maxChunks = MAX_CHUNKS,
  maxChars = MAX_CHARS
) {
  if (!Array.isArray(chunks)) {
    return [];
  }

  const result = [];

  let totalCharacters = 0;

  for (
    const chunk of chunks.slice(
      0,
      maxChunks
    )
  ) {
    const content =
      String(chunk.content || "");

    if (
      totalCharacters +
        content.length >
      maxChars
    ) {
      break;
    }

    result.push(chunk);

    totalCharacters +=
      content.length;
  }

  return result;
}