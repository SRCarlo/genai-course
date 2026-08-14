import { retrieveDocuments } from "./retriever.js";

import { rewriteQuery } from "./queryRewriter.js";

import { buildContext } from "./contextBuilder.js";

export async function searchKnowledgeBase({
  query,
  topK = 5,
  conversation = [],
}) {
  if (!query || !query.trim()) {
    throw new Error("query is required");
  }

  const rewrittenQuery = await rewriteQuery(query, conversation);

  const results = await retrieveDocuments(rewrittenQuery, topK);

  if (!results || results.length === 0) {
    return {
      found: false,
      query,
      rewrittenQuery,
      results: [],
      context: "No relevant information was found in the knowledge base.",
    };
  }

  const compactResults = results.map((item) => ({
    sourceId: item.sourceId,
    title: item.title,
    source: item.source,
    chunkId: item.chunkId,
    score: Number(item.score.toFixed(4)),
    content: item.content,
  }));

  return {
    found: true,
    query,
    rewrittenQuery,
    results: compactResults,
    context: buildContext(results),
  };
}
