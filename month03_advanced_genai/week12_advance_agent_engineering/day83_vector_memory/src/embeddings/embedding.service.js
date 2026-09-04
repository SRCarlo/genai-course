export class EmbeddingService {
  constructor(dimension = 128) {
    this.dimension = dimension;
  }

  async embed(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Text is required for embedding");
    }

    return this.fakeEmbedding(text);
  }

  fakeEmbedding(text) {
    const vector = new Array(this.dimension).fill(0);

    const normalized = text.toLowerCase().trim();

    for (let i = 0; i < normalized.length; i++) {
      const charCode = normalized.charCodeAt(i);

      const index = (charCode * (i + 1)) % this.dimension;

      vector[index] += Math.sin(charCode + i);
    }

    const magnitude = Math.sqrt(
      vector.reduce((sum, value) => sum + value ** 2, 0),
    );

    if (magnitude === 0) {
      return vector;
    }

    return vector.map((value) => value / magnitude);
  }
}
