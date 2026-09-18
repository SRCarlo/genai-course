export class EmbeddingService {
  constructor() {
    this.dimension = 8;
  }

  async embed(text) {
    if (!text) {
      throw new Error("EMBEDDING_INPUT_EMPTY");
    }

    const vector = new Array(this.dimension).fill(0);

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);

      vector[i % this.dimension] += charCode;
    }

    const magnitude = Math.sqrt(
      vector.reduce((sum, value) => sum + value * value, 0),
    );

    if (magnitude === 0) {
      return vector;
    }

    return vector.map((value) => value / magnitude);
  }

  async embedMany(texts) {
    return Promise.all(texts.map((text) => this.embed(text)));
  }
}
