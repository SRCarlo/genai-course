const allowedTools = new Set(["search_own_documents"]);

export function validateToolRequest(toolRequest) {
  if (!toolRequest || typeof toolRequest.name !== "string" || !allowedTools.has(toolRequest.name)) {
    throw new Error("Tool is not permitted");
  }
  if (toolRequest.name === "search_own_documents" &&
      (!toolRequest.arguments ||
       typeof toolRequest.arguments.query !== "string" ||
       toolRequest.arguments.query.trim().length === 0 ||
       toolRequest.arguments.query.length > 1000)) {
    throw new Error("Invalid tool arguments");
  }
  return {
    name: toolRequest.name,
    arguments: { query: toolRequest.arguments.query.trim() },
  };
}
