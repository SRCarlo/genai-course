import { tokenize } from "../embeddings/embedding.service.js";
export class KeywordSearch {
  constructor({ repository }) {
    this.repository = repository;
  }
  async search(query, options = {}) {
    const topK = options.topK ?? 10;
    const q = new Set(tokenize(query));
    const docs = await this.repository.findAll();
    return docs
      .map((d) => {
        const tokens = tokenize(
          `${d.title} ${d.content} ${JSON.stringify(d.metadata || {})}`,
        );
        const counts = new Map();
        for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
        let score = 0;
        for (const t of q)
          if (counts.has(t)) score += 1 + Math.log1p(counts.get(t));
        return { ...d, keywordScore: score };
      })
      .filter((d) => d.keywordScore > 0)
      .sort((a, b) => b.keywordScore - a.keywordScore)
      .slice(0, topK);
  }
}
