/**
 * Simple Semantic Chunking
 * Groups text by blank-line-separated topics.
 */

function semanticChunk(text) {
  const sections = text.split(/\n\s*\n/).filter(Boolean);

  return sections.map((section, index) => ({
    id: index + 1,

    text: section.trim(),

    metadata: {
      type: "semantic",

      topic: `Topic ${index + 1}`,
    },
  }));
}

module.exports = semanticChunk;

/* Run directly */
if (require.main === module) {
  const text = `
Node.js uses V8.

Express builds APIs.

MongoDB stores documents.
`;

  console.log(semanticChunk(text));
}
