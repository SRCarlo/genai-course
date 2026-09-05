export function chunkText(text, chunkSize = 120, overlap = 30) {
  const words = text.split(/\s+/).filter(Boolean);

  if (!words.length) {
    return [];
  }

  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words.slice(start, end).join(" ");

    chunks.push(chunk);

    if (end === words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
