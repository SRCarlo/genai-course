import {
  createEmbedding,
  cosineSimilarity,
} from "../embeddings/embedding.service.js";
export class VectorSearch {
  constructor({ repository }) {
    this.repository = repository;
  }
  async search(queryEmbedding, options = {}) {
    const topK = options.topK ?? 10;
    const docs = await this.repository.findAll();
    return docs
      .map((d) => ({
        ...d,
        vectorScore: cosineSimilarity(
          queryEmbedding,
          d.embedding || createEmbedding(d.content),
        ),
      }))
      .sort((a, b) => b.vectorScore - a.vectorScore)
      .slice(0, topK);
  }
}
