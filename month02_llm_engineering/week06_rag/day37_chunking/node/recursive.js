/**
 * Recursive Chunking
 * Splits by paragraphs first.
 * If a paragraph is too large,
 * splits by sentences.
 */

function recursiveChunk(text, maxLength = 150) {
  const result = [];

  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);

  paragraphs.forEach((paragraph) => {
    if (paragraph.length <= maxLength) {
      result.push({
        id: result.length + 1,
        text: paragraph.trim(),
        metadata: {
          type: "recursive",
          level: "paragraph",
        },
      });
    } else {
      const sentences = paragraph.split(". ").filter(Boolean);

      sentences.forEach((sentence) => {
        result.push({
          id: result.length + 1,
          text: sentence.trim(),
          metadata: {
            type: "recursive",
            level: "sentence",
          },
        });
      });
    }
  });

  return result;
}

module.exports = recursiveChunk;

/* Run directly */
if (require.main === module) {
  const text = `
Node.js is an open-source runtime.

Express.js is popular.

MongoDB stores data.
`;

  console.log(recursiveChunk(text));
}
