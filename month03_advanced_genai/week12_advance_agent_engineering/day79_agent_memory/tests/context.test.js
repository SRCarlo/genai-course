import {
  estimateTokens,
  estimateContextTokens,
} from "../src/context/tokenizer.js";

import { buildManagedContext } from "../src/context/context.manager.js";

describe("Context Management", () => {
  test("should estimate tokens", () => {
    const tokens = estimateTokens("Hello world");

    expect(tokens).toBeGreaterThan(0);
  });

  test("should limit messages", async () => {
    const messages = Array.from(
      {
        length: 30,
      },
      (_, index) => ({
        role: "user",
        content: `Message ${index}`,
      }),
    );

    const context = await buildManagedContext({
      systemPrompt: "You are helpful.",

      memories: [],

      messages,

      maxMessages: 10,

      maxTokens: 10000,
    });

    expect(context.messages.length).toBe(10);
  });

  test("should prune when context exceeds budget", async () => {
    const messages = Array.from(
      {
        length: 20,
      },
      (_, index) => ({
        role: "user",
        content: "A".repeat(1000) + ` ${index}`,
      }),
    );

    const context = await buildManagedContext({
      systemPrompt: "System",

      memories: [],

      messages,

      maxMessages: 20,

      maxTokens: 1000,
    });

    expect(context.messages.length).toBeLessThan(20);
  });
});
