import { createEmbedding } from "../embeddings/embedding.service.js";
import { deduplicate } from "../retrieval/deduplicator.js";
import { filterByRelevance } from "../retrieval/relevance.filter.js";
import { buildContext } from "./context.builder.js";
export class RAGService {
  constructor({
    queryRewriter,
    queryExpander,
    hybridSearch,
    reranker,
    llmService,
  }) {
    Object.assign(this, {
      queryRewriter,
      queryExpander,
      hybridSearch,
      reranker,
      llmService,
    });
  }
  async run({ question, conversation = [] }) {
    const rewrittenQuery = await this.queryRewriter.rewrite({
      question,
      conversation,
    });
    const expandedQueries = await this.queryExpander.expand(rewrittenQuery);
    const candidates = [];
    for (const query of expandedQueries) {
      const results = await this.hybridSearch.search({
        query,
        queryEmbedding: createEmbedding(query),
        topK: 10,
      });
      candidates.push(...results);
    }
    const uniqueCandidates = deduplicate(candidates);
    const reranked = await this.reranker.rerank({
      query: rewrittenQuery,
      documents: uniqueCandidates,
      topN: Number(process.env.RERANK_TOP_N || 5),
    });
    const finalResults = filterByRelevance(
      reranked,
      Number(process.env.RELEVANCE_THRESHOLD || 0),
    );
    const context = buildContext(finalResults);
    const answer = await this.llmService.complete({
      system:
        "You are a grounded RAG assistant. Answer only from the supplied context. If insufficient, say so. Cite sources as [SOURCE N]. Do not invent facts.",
      user: `Question:\n${question}\n\nContext:\n${context}`,
      temperature: 0.2,
      maxCompletionTokens: 1200,
    });
    return {
      answer,
      rewrittenQuery,
      expandedQueries,
      sources: finalResults.map((r) => ({
        id: r.id,
        title: r.title,
        source: r.metadata?.source,
        fusionScore: r.fusionScore,
        rerankScore: r.rerankScore,
      })),
    };
  }
}
