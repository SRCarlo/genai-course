import { LLMService } from "../llm/llm.service.js";
export class Reranker {
  constructor({ llmService = new LLMService() } = {}) {
    this.llmService = llmService;
  }
  async rerank({ query, documents, topN = 5 }) {
    if (!documents.length) return [];
    const candidates = documents.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      metadata: d.metadata,
    }));
    const result = await this.llmService.completeJSON({
      system:
        "You are a retrieval reranker. Score every candidate from 0 to 1 for direct relevance to the query. Return only the requested JSON. Never invent IDs.",
      user: JSON.stringify({ query, candidates }),
      schema: {
        name: "rerank_results",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  id: { type: "string" },
                  score: { type: "number" },
                },
                required: ["id", "score"],
              },
            },
          },
          required: ["results"],
        },
      },
    });
    const byId = new Map(documents.map((d) => [d.id, d]));
    return result.results
      .filter((x) => byId.has(x.id))
      .map((x) => ({
        ...byId.get(x.id),
        rerankScore: Math.max(0, Math.min(1, Number(x.score) || 0)),
      }))
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, topN);
  }
}
