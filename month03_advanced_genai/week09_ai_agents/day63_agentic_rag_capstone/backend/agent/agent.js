import { createAgentState } from "./state.js";

import { runReactLoop } from "./reactLoop.js";

import { getHistory, addMessage } from "../memory/conversationMemory.js";

export async function runAgent({ question, sessionId }) {
  const history = getHistory(sessionId);

  const state = createAgentState({
    question,
    sessionId,
    history,
  });

  try {
    const finalState = await runReactLoop(state);

    addMessage(sessionId, {
      role: "user",
      content: question,
    });

    addMessage(sessionId, {
      role: "assistant",
      content: finalState.finalAnswer,
    });

    return {
      answer: finalState.finalAnswer,

      sources: finalState.sources,

      trace: finalState.trace,

      iterations: finalState.iteration,

      toolCalls: finalState.toolCalls,

      ragCalls: finalState.ragCalls,

      status: finalState.status,
    };
  } catch (error) {
    state.status = "error";

    throw error;
  }
}
