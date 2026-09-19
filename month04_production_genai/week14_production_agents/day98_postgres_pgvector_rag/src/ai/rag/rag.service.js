import { buildContext } from "./context.builder.js";

export class RagService {
  constructor({ embeddingService, retriever, llmService }) {
    this.embeddingService = embeddingService;
    this.retriever = retriever;
    this.llmService = llmService;
  }

  async answer({ question, tenantId }) {
    const startedAt = Date.now();

    const queryVector = await this.embeddingService.embed(question);

    const results = await this.retriever.retrieve({
      queryVector,
      tenantId
    });

    if (!results.length) {
      return {
        answer: "I don't have enough information to answer that.",
        sources: [],
        latencyMs: Date.now() - startedAt
      };
    }

    const context = buildContext(results);

    const answer = await this.llmService.generate({
      question,
      context
    });

    return {
      answer,
      sources: results.map((result) => ({
        documentId: result.document_id,
        metadata: result.metadata,
        distance: Number(result.distance)
      })),
      latencyMs: Date.now() - startedAt
    };
  }
}
