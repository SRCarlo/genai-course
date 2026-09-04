export function chunkText(text, maxCharacters = 500, overlap = 50) {
  if (!text || typeof text !== "string") {
    return [];
  }

  if (maxCharacters <= 0) {
    throw new Error("maxCharacters must be greater than 0");
  }

  if (overlap < 0 || overlap >= maxCharacters) {
    throw new Error("overlap must be >= 0 and < maxCharacters");
  }

  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxCharacters, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
