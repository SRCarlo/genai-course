import { normalizeQuery } from "../services/queryService.js";
import { hybridSearch } from "../services/hybridSearchService.js";
import { rerank } from "../services/rerankerService.js";
import { buildContext, extractSources } from "../services/contextService.js";
import { generateAnswer } from "../services/llmService.js";
import { getCached, setCached } from "../services/cacheService.js";

export async function chat(req, res) {
  const startTime = Date.now();

  try {
    const question = normalizeQuery(req.body?.question);

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
        requestId: req.requestId,
      });
    }

    const cacheKey = question.toLowerCase();

    const cached = getCached(cacheKey);

    if (cached) {
      return res.json({
        ...cached,
        requestId: req.requestId,
        metadata: {
          ...cached.metadata,
          cacheHit: true,
          latencyMs: Date.now() - startTime,
        },
      });
    }

    const retrievalStart = Date.now();

    const hybridResults = await hybridSearch(question);

    const retrievalLatency = Date.now() - retrievalStart;

    if (hybridResults.length === 0) {
      const result = {
        success: true,
        answer:
          "I don't have enough information in the knowledge base to answer that.",
        sources: [],
        metadata: {
          retrievedDocuments: 0,
          retrievalLatencyMs: retrievalLatency,
          rerankingLatencyMs: 0,
          llmLatencyMs: 0,
          totalLatencyMs: Date.now() - startTime,
          cacheHit: false,
        },
      };

      setCached(cacheKey, result);

      return res.json({
        ...result,
        requestId: req.requestId,
      });
    }

    const rerankStart = Date.now();

    const reranked = await rerank(question, hybridResults);

    const rerankingLatency = Date.now() - rerankStart;

    const context = buildContext(reranked);

    const llmStart = Date.now();

    const answer = await generateAnswer({
      question,
      context,
    });

    const llmLatency = Date.now() - llmStart;

    const sources = extractSources(reranked);

    const result = {
      success: true,
      answer,
      sources,
      metadata: {
        retrievedDocuments: hybridResults.length,
        selectedDocuments: reranked.length,
        retrievalLatencyMs: retrievalLatency,
        rerankingLatencyMs: rerankingLatency,
        llmLatencyMs: llmLatency,
        totalLatencyMs: Date.now() - startTime,
        cacheHit: false,
      },
    };

    setCached(cacheKey, result);

    console.log(
      JSON.stringify({
        requestId: req.requestId,
        question,
        ...result.metadata,
      }),
    );

    return res.json({
      ...result,
      requestId: req.requestId,
    });
  } catch (error) {
    console.error(`[${req.requestId}] RAG error:`, error.message);

    return res.status(500).json({
      success: false,
      message: "RAG pipeline failed",
      error: error.message,
      requestId: req.requestId,
    });
  }
}
