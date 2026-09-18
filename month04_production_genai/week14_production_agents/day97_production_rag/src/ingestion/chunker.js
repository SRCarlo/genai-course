export function chunkText(text, chunkSize = 500, overlap = 50) {
  if (!text) {
    return [];
  }

  if (chunkSize <= 0) {
    throw new Error("INVALID_CHUNK_SIZE");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error("INVALID_CHUNK_OVERLAP");
  }

  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
}
