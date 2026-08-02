export const chunkText = (text, chunkSize = 500) => {
  const words = text.split(" ");

  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
};
