import { createAgentCompletion } from "../services/llm.service.js";

export async function planNextAction(state) {
  const response = await createAgentCompletion(state.messages);

  state.metrics.llmCalls++;

  const message = response.choices[0].message;

  return message;
}
