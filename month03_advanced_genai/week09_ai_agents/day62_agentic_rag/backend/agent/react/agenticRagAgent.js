import { runReactLoop } from "./reactLoop.js";

export async function runAgenticRagAgent({ question, sessionId }) {
  if (!question || !question.trim()) {
    throw new Error("question is required");
  }

  const result = await runReactLoop({
    question: question.trim(),
    sessionId,
  });

  return result;
}
