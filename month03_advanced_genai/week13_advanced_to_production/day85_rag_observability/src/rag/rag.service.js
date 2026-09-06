import { createRequestId } from "../observability/request.context.js";
import { createTrace, finishTrace } from "../observability/trace.js";
import { logger } from "../observability/logger.js";
import { measure } from "../observability/timer.js";
import { calculateCost } from "../observability/cost.tracker.js";
import { env } from "../config/env.js";

export class RagService {
  constructor({
    queryRewriter,
    vectorRetriever,
    keywordRetriever,
    hybridRetriever,
    reranker,
    contextBuilder,
    llm
  }) {
    this.queryRewriter = queryRewriter;
    this.vectorRetriever = vectorRetriever;
    this.keywordRetriever = keywordRetriever;
    this.hybridRetriever = hybridRetriever;
    this.reranker = reranker;
    this.contextBuilder = contextBuilder;
    this.llm = llm;
  }

  async query(question) {
    const requestId =
      createRequestId();

    const trace = createTrace({
      requestId,
      query: question
    });

    const requestStart =
      performance.now();

    logger.info(
      "rag_request_started",
      {
        requestId,
        query: question
      }
    );

    try {
      const rewrite = await measure(
        "query_rewrite",
        async () =>
          this.queryRewriter.rewrite(
            question
          )
      );

      if (rewrite.error) {
        throw rewrite.error;
      }

      trace.rewrittenQuery =
        rewrite.result;

      trace.timings.queryRewrite =
        rewrite.latencyMs;

      const vector = await measure(
        "vector_search",
        async () =>
          this.vectorRetriever.search(
            rewrite.result,
            env.topK
          )
      );

      if (vector.error) {
        throw vector.error;
      }

      trace.retrieval.vectorResults =
        vector.result;

      trace.timings.vectorSearch =
        vector.latencyMs;

      const keyword = await measure(
        "keyword_search",
        async () =>
          this.keywordRetriever.search(
            rewrite.result,
            env.topK
          )
      );

      if (keyword.error) {
        throw keyword.error;
      }

      trace.retrieval.keywordResults =
        keyword.result;

      trace.timings.keywordSearch =
        keyword.latencyMs;

      const hybrid = await measure(
        "hybrid_search",
        async () =>
          this.hybridRetriever.search(
            rewrite.result,
            env.topK
          )
      );

      if (hybrid.error) {
        throw hybrid.error;
      }

      trace.retrieval.hybridResults =
        hybrid.result;

      trace.timings.hybridSearch =
        hybrid.latencyMs;

      const reranked = await measure(
        "reranking",
        async () =>
          this.reranker.rerank(
            rewrite.result,
            hybrid.result,
            env.rerankK
          )
      );

      if (reranked.error) {
        throw reranked.error;
      }

      trace.retrieval.rerankedResults =
        reranked.result;

      trace.timings.reranking =
        reranked.latencyMs;

      if (
        trace.retrieval.rerankedResults
          .length === 0
      ) {
        trace.errors.push({
          type: "retrieval_failure",
          message:
            "No relevant documents were retrieved."
        });

        return {
          requestId,
          answer:
            "I don't have enough information to answer that question.",
          sources: [],
          trace: finishTrace(trace)
        };
      }

      const context = await measure(
        "context_build",
        async () =>
          this.contextBuilder.build(
            reranked.result
          )
      );

      if (context.error) {
        throw context.error;
      }

      trace.context =
        context.result;

      trace.timings.contextBuild =
        context.latencyMs;

      const generation = await measure(
        "llm_generation",
        async () =>
          this.llm.generate({
            question,
            context:
              context.result.text
          })
      );

      if (generation.error) {
        trace.errors.push({
          type: "generation_failure",
          message:
            generation.error.message
        });

        throw generation.error;
      }

      trace.timings.llmGeneration =
        generation.latencyMs;

      trace.generation = {
        model: generation.result.model,

        inputTokens:
          generation.result.usage
            .inputTokens,

        outputTokens:
          generation.result.usage
            .outputTokens,

        totalTokens:
          generation.result.usage
            .totalTokens,

        latencyMs:
          generation.latencyMs
      };

      trace.cost =
        calculateCost({
          inputTokens:
            trace.generation.inputTokens,

          outputTokens:
            trace.generation.outputTokens,

          inputPricePerMillion:
            env.inputPricePerMillion,

          outputPricePerMillion:
            env.outputPricePerMillion
        });

      trace.totalLatencyMs =
        Math.round(
          performance.now() -
            requestStart
        );

      finishTrace(trace);

      logger.info(
        "rag_request_completed",
        {
          requestId,

          totalLatencyMs:
            trace.totalLatencyMs,

          inputTokens:
            trace.generation.inputTokens,

          outputTokens:
            trace.generation.outputTokens,

          totalCost:
            trace.cost.totalCost
        }
      );

      return {
        requestId,

        answer:
          generation.result.answer,

        sources:
          trace.retrieval
            .rerankedResults
            .map((result) => ({
              documentId: result.id,
              title: result.title,
              score:
                result.rerankScore
            })),

        trace
      };
    } catch (error) {
      trace.errors.push({
        type: "rag_failure",
        message: error.message
      });

      trace.totalLatencyMs =
        Math.round(
          performance.now() -
            requestStart
        );

      finishTrace(trace);

      logger.error(
        "rag_request_failed",
        {
          requestId,
          error: error.message
        }
      );

      throw error;
    }
  }
}