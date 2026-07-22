import docs from "../data/docs.json" with { type: "json" };

export function retrieveContext(question) {
  const query = question.toLowerCase();

  const results = docs.filter(
    (doc) =>
      doc.text.toLowerCase().includes(query) ||
      (query.includes("node") && doc.text.includes("Node")) ||
      (query.includes("express") && doc.text.includes("Express")) ||
      (query.includes("rag") && doc.text.includes("RAG")) ||
      (query.includes("langchain") && doc.text.includes("LangChain")),
  );

  return results.map((doc) => doc.text).join("\n");
}
