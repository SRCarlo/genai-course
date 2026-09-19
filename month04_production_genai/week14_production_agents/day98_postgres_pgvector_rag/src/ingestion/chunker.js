export function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize ?? 800;
  const overlap = options.overlap ?? 120;

  if (overlap >= chunkSize) {
    throw new Error("OVERLAP_MUST_BE_SMALLER_THAN_CHUNK_SIZE");
  }

  const normalized = String(text ?? "").trim();
  if (!normalized) return [];

  const words = normalized.split(/\s+/);
  const chunks = [];

  let start = 0;
  let index = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const content = words.slice(start, end).join(" ");

    chunks.push({
      index,
      content
    });

    if (end === words.length) break;

    start = end - overlap;
    index += 1;
  }

  return chunks;
}
