import { tokenize } from "./tokenizer.js";

export class TfidfIndex {
  constructor(documents) {
    this.documents = documents;

    this.documentTokens = new Map();
    this.documentFrequency = new Map();

    this.build();
  }

  build() {
    for (const document of this.documents) {
      const tokens = tokenize(
        `${document.title} ${document.content}`
      );

      this.documentTokens.set(document.id, tokens);

      const uniqueTokens = new Set(tokens);

      for (const token of uniqueTokens) {
        const current =
          this.documentFrequency.get(token) || 0;

        this.documentFrequency.set(
          token,
          current + 1
        );
      }
    }
  }

  calculateIdf(token) {
    const totalDocuments = this.documents.length;

    const documentFrequency =
      this.documentFrequency.get(token) || 0;

    if (documentFrequency === 0) {
      return 0;
    }

    return Math.log(
      (totalDocuments + 1) /
        (documentFrequency + 1)
    ) + 1;
  }

  vectorize(tokens) {
    const frequencies = new Map();

    for (const token of tokens) {
      frequencies.set(
        token,
        (frequencies.get(token) || 0) + 1
      );
    }

    const vector = new Map();

    for (const [token, frequency] of frequencies) {
      const tf = frequency / tokens.length;
      const idf = this.calculateIdf(token);

      vector.set(token, tf * idf);
    }

    return vector;
  }

  cosineSimilarity(vectorA, vectorB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    const allTokens = new Set([
      ...vectorA.keys(),
      ...vectorB.keys()
    ]);

    for (const token of allTokens) {
      const a = vectorA.get(token) || 0;
      const b = vectorB.get(token) || 0;

      dotProduct += a * b;
      magnitudeA += a * a;
      magnitudeB += b * b;
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return (
      dotProduct /
      (Math.sqrt(magnitudeA) *
        Math.sqrt(magnitudeB))
    );
  }

  search(query, limit = 10) {
    const queryTokens = tokenize(query);
    const queryVector = this.vectorize(queryTokens);

    return this.documents
      .map((document) => {
        const documentVector = this.vectorize(
          this.documentTokens.get(document.id)
        );

        const score = this.cosineSimilarity(
          queryVector,
          documentVector
        );

        return {
          ...document,
          score,
          retrievalMethod: "tfidf"
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}