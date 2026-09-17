import { describe, it, expect } from "vitest";

import { llmService } from "../src/ai/llm/llm.service.js";

import { supportAgent } from "../src/ai/agents/support.agent.js";

import { chatService } from "../src/application/chat.service.js";

describe("Architecture", () => {
  it("should expose LLM service", () => {
    expect(llmService).toBeDefined();

    expect(typeof llmService.generate).toBe("function");
  });

  it("should expose support agent", () => {
    expect(supportAgent).toBeDefined();

    expect(typeof supportAgent.run).toBe("function");
  });

  it("should expose chat service", () => {
    expect(chatService).toBeDefined();

    expect(typeof chatService.execute).toBe("function");
  });
});
