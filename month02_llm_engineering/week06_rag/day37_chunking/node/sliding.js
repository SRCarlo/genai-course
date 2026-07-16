/**
 * Sliding Window Chunking
 * Creates overlapping chunks.
 */

function slidingChunk(text, windowSize = 5, overlap = 2) {
  const words = text.split(/\s+/);

  const chunks = [];

  const step = windowSize - overlap;

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + windowSize);

    if (chunk.length === 0) break;

    chunks.push({
      id: chunks.length + 1,

      text: chunk.join(" "),

      metadata: {
        type: "sliding",

        windowSize,

        overlap,
      },
    });

    if (i + windowSize >= words.length) {
      break;
    }
  }

  return chunks;
}

module.exports = slidingChunk;

/* Run directly */
if (require.main === module) {
  const text =
    "Node.js uses Google's V8 engine to execute JavaScript efficiently.";

  console.log(slidingChunk(text, 4, 2));
}
