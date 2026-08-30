import { createAgentState } from "./state.js";
import { runAgent } from "./orchestrator.js";

export async function executeAgent(query) {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new Error("Query must be a non-empty string");
  }

  const state = createAgentState(query.trim());

  return runAgent(state);
}
