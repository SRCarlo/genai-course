import { retrieveDocuments } from "../rag/retriever.js";

export async function ragSearchTool(input) {
  const { query, topK = 3 } = input;

  if (!query || !query.trim()) {
    throw new Error("query is required");
  }

  const safeTopK = Math.min(Number(topK) || 3, 3);

  const results = await retrieveDocuments(query.trim(), safeTopK);

  return {
    found: results.length > 0,

    results: results.slice(0, 3),
  };
}
