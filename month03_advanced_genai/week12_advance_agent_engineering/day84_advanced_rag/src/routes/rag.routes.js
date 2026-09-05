import express from "express";

import { analyzeQuery } from "../query/query.analyzer.js";

import { rewriteQuery } from "../query/query.rewriter.js";

import { expandQuery } from "../query/query.expander.js";

import { retrieve } from "../retrieval/retriever.js";

import { rerank } from "../reranking/reranker.js";

import { buildContext } from "../context/context.builder.js";

import { generateAnswer } from "../llm/llm.service.js";

import { getDocuments } from "../store/document.store.js";

export function createRagRouter({ groq, vocabulary }) {
  const router = express.Router();

  router.post("/query", async (req, res) => {
    const startedAt = Date.now();

    try {
      const { query, history = [], filters = {} } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Query is required",
        });
      }

      const analysis = analyzeQuery(query);

      const rewrittenQuery = await rewriteQuery(groq, query, history);

      const expandedQueries = await expandQuery(groq, rewrittenQuery);

      const documents = getDocuments();

      const allResults = [];

      for (const searchQuery of expandedQueries) {
        const results = retrieve({
          query: searchQuery,
          documents,
          vocabulary,
          filters,
          topK: 20,
        });

        allResults.push(...results);
      }

      const uniqueResults = new Map();

      for (const result of allResults) {
        const existing = uniqueResults.get(result.id);

        if (!existing || result.hybridScore > existing.hybridScore) {
          uniqueResults.set(result.id, result);
        }
      }

      const candidates = [...uniqueResults.values()]
        .sort((a, b) => b.hybridScore - a.hybridScore)
        .slice(0, 20);

      if (!candidates.length) {
        return res.json({
          query,
          rewrittenQuery,
          answer:
            "I could not find relevant information in the knowledge base.",
          sources: [],
          metrics: {
            latencyMs: Date.now() - startedAt,
          },
        });
      }

      const reranked = rerank(rewrittenQuery, candidates, 5);

      const bestScore = reranked[0]?.rerankScore || 0;

      const retrievalThreshold = 0.05;

      if (bestScore < retrievalThreshold) {
        return res.json({
          query,
          rewrittenQuery,
          answer:
            "I do not have sufficiently relevant information in the knowledge base to answer that reliably.",
          sources: [],
          metrics: {
            latencyMs: Date.now() - startedAt,
            bestScore,
          },
        });
      }

      const context = buildContext(reranked, {
        maxDocuments: 3,
        maxTokens: 2500,
        minimumScore: retrievalThreshold,
      });

      const answer = await generateAnswer(groq, query, context.context);

      const sources = context.documents.map((document) => ({
        document: document.source,
        documentId: document.documentId,
        chunk: document.chunkIndex,
        score: Number(document.rerankScore.toFixed(4)),
      }));

      const latencyMs = Date.now() - startedAt;

      console.log(
        JSON.stringify({
          query,
          rewrittenQuery,
          expandedQueries,
          retrievedCount: candidates.length,
          rerankedCount: reranked.length,
          finalContextCount: context.documents.length,
          estimatedContextTokens: context.estimatedTokens,
          latencyMs,
        }),
      );

      return res.json({
        query,
        analysis,
        rewrittenQuery,
        expandedQueries,
        answer,
        sources,
        metrics: {
          retrievedCount: candidates.length,
          rerankedCount: reranked.length,
          contextDocuments: context.documents.length,
          estimatedContextTokens: context.estimatedTokens,
          latencyMs,
        },
      });
    } catch (error) {
      console.error("RAG error:", error);

      return res.status(500).json({
        error: "RAG request failed",
      });
    }
  });

  return router;
}
