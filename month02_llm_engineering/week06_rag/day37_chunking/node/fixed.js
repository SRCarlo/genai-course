/**
 * Fixed Chunking
 * Splits text into equal-sized character chunks.
 */

function fixedChunk(text, chunkSize = 100) {
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({
      id: chunks.length + 1,
      text: text.slice(i, i + chunkSize),
      metadata: {
        type: "fixed",
        chunkSize,
        length: text.slice(i, i + chunkSize).length,
      },
    });
  }

  return chunks;
}

module.exports = fixedChunk;

/* Run directly */
if (require.main === module) {
  const text = "Hello Node.js Developers! Welcome to Chunking.";
  console.log(fixedChunk(text, 10));
}
