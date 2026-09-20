import { LLMService } from "../llm/llm.service.js";
export class QueryExpander {
  constructor({ llmService = new LLMService() } = {}) {
    this.llmService = llmService;
  }
  async expand(query) {
    const result = await this.llmService.completeJSON({
      system:
        "Generate 2 to 4 concise alternative search queries for RAG retrieval. Keep technical identifiers unchanged. Do not answer the question.",
      user: `Original query: ${query}`,
      schema: {
        name: "query_expansion",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: { queries: { type: "array", items: { type: "string" } } },
          required: ["queries"],
        },
      },
    });
    return [
      ...new Set([
        query,
        ...(Array.isArray(result.queries)
          ? result.queries.filter(Boolean).map((x) => x.trim())
          : []),
      ]),
    ].slice(0, 5);
  }
}
