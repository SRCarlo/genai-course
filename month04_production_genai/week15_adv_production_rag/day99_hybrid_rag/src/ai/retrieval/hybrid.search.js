import { reciprocalRankFusion } from "./rrf.js";
export class HybridSearch {
  constructor({ vectorSearch, keywordSearch }) {
    this.vectorSearch = vectorSearch;
    this.keywordSearch = keywordSearch;
  }
  async search({ query, queryEmbedding, topK = 10 }) {
    const [vectorResults, keywordResults] = await Promise.all([
      this.vectorSearch.search(queryEmbedding, { topK }),
      this.keywordSearch.search(query, { topK }),
    ]);
    return reciprocalRankFusion(
      [vectorResults, keywordResults],
      Number(process.env.RRF_K || 60),
    ).slice(0, topK);
  }
}
