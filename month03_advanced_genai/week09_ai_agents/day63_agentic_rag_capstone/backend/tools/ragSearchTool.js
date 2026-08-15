import { retrieveDocuments } from "../rag/retriever.js";
import { rewriteQuery } from "../rag/queryRewriter.js";
import { buildContext } from "../rag/contextBuilder.js";
import { addSources } from "../rag/sourceTracker.js";
import { getHistory } from "../memory/conversationMemory.js";

export async function ragSearchTool({ query, sessionId, topK = 5, state }) {
  if (!query) {
    throw new Error("Query is required");
  }

  if (state && state.ragCalls >= state.maxRagCalls) {
    throw new Error("Maximum RAG calls reached");
  }

  if (state) {
    state.ragCalls++;
  }

  const history = getHistory(sessionId);

  const rewrittenQuery = await rewriteQuery(query, history);

  const results = await retrieveDocuments(rewrittenQuery, topK);

  if (state && results.length > 0) {
    addSources(state, results);
  }

  return {
    found: results.length > 0,
    query,
    rewrittenQuery,
    results,
    context: buildContext(results),
  };
}
