import { createAgentState } from "../agent/state.js";
import { runReactLoop } from "../agent/reactLoop.js";
import { addMessage } from "../memory/conversationMemory.js";
import { getHistory } from "../memory/conversationMemory.js";

export async function runAgenticRag(req, res, next) {
  try {
    const { sessionId, question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "question must be a non-empty string",
      });
    }

    const session = sessionId || "default";

    const state = createAgentState({
      question: question.trim(),

      sessionId: session,
    });

    /*
     * Load previous conversation.
     */
    const previousHistory = getHistory(session);

    /*
     * Keep previous messages but
     * don't duplicate current question.
     */
    state.history = [
      ...previousHistory,

      {
        role: "user",
        content: question.trim(),
      },
    ];

    const result = await runReactLoop(state);

    /*
     * Save conversation.
     */
    addMessage(session, {
      role: "user",
      content: question.trim(),
    });

    addMessage(session, {
      role: "assistant",
      content: result.finalAnswer,
    });

    return res.json({
      answer: result.finalAnswer,

      sources: result.sources,

      trace: result.trace,

      status: result.status,
    });
  } catch (error) {
    next(error);
  }
}
