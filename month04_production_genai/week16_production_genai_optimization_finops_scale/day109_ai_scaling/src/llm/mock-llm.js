import { config } from "../config/load-config.js";

export async function mockLLM({ message = "Hello AI" } = {}) {
  const startedAt = Date.now();

  await new Promise((resolve) =>
    setTimeout(resolve, config.mockLatencyMs)
  );

  return {
    text: `Mock AI response for: ${message}`,
    usage: {
      inputTokens: 100,
      outputTokens: 50
    },
    latencyMs: Date.now() - startedAt
  };
}
