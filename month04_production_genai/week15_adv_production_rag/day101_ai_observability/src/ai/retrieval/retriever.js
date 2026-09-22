const documents = [
  {
    id: "doc-1",
    title: "RAG",
    content:
      "RAG stands for Retrieval Augmented Generation. It retrieves relevant documents and provides them as context to an LLM.",
  },
  {
    id: "doc-2",
    title: "Observability",
    content:
      "AI observability includes logs, metrics, traces, latency, token usage, cost and quality monitoring.",
  },
  {
    id: "doc-3",
    title: "SLO",
    content:
      "An SLO is a target for a service level indicator. Examples include P95 latency and error rate.",
  },
  {
    id: "doc-4",
    title: "Request ID",
    content:
      "A request ID allows production teams to correlate logs, traces, errors and model calls for one request.",
  },
  {
    id: "doc-5",
    title: "Drift",
    content:
      "Distribution drift occurs when production traffic changes compared with the data distribution used during development.",
  },
];
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}
function scoreDocument(query, document) {
  const queryTokens = new Set(tokenize(query));
  return tokenize(document.content).reduce(
    (matches, token) => matches + (queryTokens.has(token) ? 1 : 0),
    0,
  );
}
export async function retrieveDocuments(query, limit = 5) {
  return documents
    .map((document) => ({ ...document, score: scoreDocument(query, document) }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
