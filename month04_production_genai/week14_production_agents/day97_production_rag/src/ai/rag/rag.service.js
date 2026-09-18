import { buildContext } from "./context.builder.js";

export class RagService {
  constructor({
    embeddingService,
    retriever,
    llmService,
    topK = 5,
    threshold = 0.1,
  }) {
    this.embeddingService = embeddingService;

    this.retriever = retriever;

    this.llmService = llmService;

    this.topK = topK;

    this.threshold = threshold;
  }

  async answer(question, options = {}) {
    const { tenantId, userId } = options;

    const queryVector = await this.embeddingService.embed(question);

    const results = await this.retriever.retrieve(queryVector, {
      topK: this.topK,

      threshold: this.threshold,

      filter: {
        tenantId,
        userId,
      },
    });

    if (!results.length) {
      return {
        answer: "I don't have enough information to answer that.",

        sources: [],
      };
    }

    const context = buildContext(results);

    const answer = await this.llmService.generate({
      question,
      context,
    });

    return {
      answer,

      sources: results.map((result) => ({
        documentId: result.documentId,

        chunkId: result.id,

        documentName: result.metadata?.source,

        page: result.metadata?.page,

        chunk: result.chunkIndex,

        score: Number(result.score.toFixed(4)),
      })),
    };
  }
}
