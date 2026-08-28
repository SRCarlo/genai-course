import { createAgentState } from "./state.js";
import { runAgentLoop } from "./loop.js";
import { getTerminationMessage } from "./termination.js";

export async function runAgent(query) {
  const state = createAgentState(query);

  const finalState = await runAgentLoop(state);

  if (!finalState.finalAnswer && finalState.status !== "completed") {
    finalState.finalAnswer =
      getTerminationMessage(finalState) ||
      "I was unable to complete the request.";
  }

  return {
    success: finalState.status === "completed",

    answer: finalState.finalAnswer,

    toolsUsed: finalState.toolCalls.map((call) => call.tool),

    toolCalls: finalState.toolCalls,

    iterations: finalState.iteration,

    sources: finalState.sources,

    status: finalState.status,

    metrics: finalState.metrics,
  };
}
