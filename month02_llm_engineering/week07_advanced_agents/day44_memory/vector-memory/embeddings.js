export function createEmbedding(text) {
  const vector = [];

  for (let i = 0; i < text.length; i++) {
    vector.push(text.charCodeAt(i));
  }

  return vector;
}
