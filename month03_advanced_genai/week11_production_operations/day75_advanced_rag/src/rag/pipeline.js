import { rewriteQuery } from "./query-rewriter.js";

import { expandQuery } from "./query-expander.js";

import { hybridSearch } from "./hybrid-search.js";

import { rerank } from "./reranker.js";

import { compressContext } from "./context-compressor.js";

import { generateAnswer } from "../services/llm.service.js";

function buildContext(documents) {
  return documents
    .map(
      (document, index) => `
[Context ${index + 1}]
Title: ${document.title}
Document ID: ${document.id}

${document.compressedContent || document.content}
`,
    )
    .join("\n");
}

export async function advancedRAG(
  query,
  {
    conversation = "",
    topK = Number(process.env.DEFAULT_TOP_K || 10),
    finalK = Number(process.env.DEFAULT_FINAL_K || 5),
    metadataFilter = {},
    useQueryExpansion = false,
    maxContextTokens = Number(process.env.MAX_CONTEXT_TOKENS || 6000),
  } = {},
) {
  const startTime = Date.now();

  // -----------------------------------------
  // 1. Query rewriting
  // -----------------------------------------

  const rewrittenQuery = await rewriteQuery(query, conversation);

  // -----------------------------------------
  // 2. Optional query expansion
  // -----------------------------------------

  let queries = [rewrittenQuery];

  if (useQueryExpansion) {
    const expanded = await expandQuery(rewrittenQuery);

    queries = [rewrittenQuery, ...expanded];
  }

  // -----------------------------------------
  // 3. Hybrid retrieval
  // -----------------------------------------

  const retrievalStart = Date.now();

  const retrievalResults = await Promise.all(
    queries.map((searchQuery) =>
      hybridSearch(searchQuery, {
        topK,
        metadataFilter,
      }),
    ),
  );

  const retrievalLatency = Date.now() - retrievalStart;

  // -----------------------------------------
  // 4. Merge candidate documents
  // -----------------------------------------

  const candidateMap = new Map();

  for (const result of retrievalResults) {
    for (const document of result.fusedResults) {
      if (!candidateMap.has(document.id)) {
        candidateMap.set(document.id, document);
      }
    }
  }

  const candidates = [...candidateMap.values()];

  // -----------------------------------------
  // 5. Reranking
  // -----------------------------------------

  const rerankerStart = Date.now();

  const reranked = await rerank(rewrittenQuery, candidates, {
    finalK,
  });

  const rerankerLatency = Date.now() - rerankerStart;

  // -----------------------------------------
  // 6. Context compression
  // -----------------------------------------

  const compressionStart = Date.now();

  const compressed = await compressContext(rewrittenQuery, reranked, {
    maxContextTokens,
  });

  const compressionLatency = Date.now() - compressionStart;

  // -----------------------------------------
  // 7. Build final context
  // -----------------------------------------

  const context = buildContext(compressed.documents);

  // -----------------------------------------
  // 8. Sources
  // -----------------------------------------

  const sources = compressed.documents.map((document) => ({
    documentId: document.id,
    title: document.title,
    section: document.metadata?.section || null,
    metadata: document.metadata,
  }));

  // -----------------------------------------
  // 9. Generate answer
  // -----------------------------------------

  const generationStart = Date.now();

  const answer = await generateAnswer({
    originalQuery: query,
    context,
    sources,
  });

  const generationLatency = Date.now() - generationStart;

  const totalLatency = Date.now() - startTime;

  return {
    answer,

    sources,

    trace: {
      originalQuery: query,
      rewrittenQuery,
      expandedQueries: useQueryExpansion ? queries : [],

      retrieval: {
        strategy: "hybrid",
        candidateCount: candidates.length,
      },

      reranking: {
        candidateCount: candidates.length,
        finalCount: reranked.length,
      },

      context: {
        documentCount: compressed.documents.length,
        estimatedTokens: compressed.totalTokens,
        maxTokens: maxContextTokens,
      },

      latency: {
        retrievalMs: retrievalLatency,
        rerankerMs: rerankerLatency,
        compressionMs: compressionLatency,
        generationMs: generationLatency,
        totalMs: totalLatency,
      },
    },
  };
}
