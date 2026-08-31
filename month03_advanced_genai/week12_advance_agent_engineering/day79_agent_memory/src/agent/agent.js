import "dotenv/config";
import Groq from "groq-sdk";

import { retrieveMemories } from "../memory/memory.retriever.js";

import { buildManagedContext } from "../context/context.manager.js";

import { buildLLMMessages } from "./context.builder.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const SYSTEM_PROMPT = `
You are a personalized developer assistant.

You help users build software.

Use relevant user/project memories when
answering questions.

Respect the user's preferences.

Do not expose internal memory implementation
details unless asked.

If a memory conflicts with an explicit
newer user statement, prefer the newer
explicit statement.
`;

export class Agent {
  constructor({ shortTermMemory, memoryStore, state }) {
    this.shortTermMemory = shortTermMemory;

    this.memoryStore = memoryStore;

    this.state = state;

    this.summary = null;
  }

  async chat(userMessage) {
    const memories = await retrieveMemories(this.memoryStore, {
      userId: this.state.userId,

      tenantId: this.state.tenantId,

      query: userMessage,

      limit: Number(process.env.MAX_MEMORY_RESULTS || 5),
    });

    const context = await buildManagedContext({
      systemPrompt: SYSTEM_PROMPT,

      memories,

      messages: this.shortTermMemory.getAll(),

      summary: this.summary,

      maxMessages: Number(process.env.MAX_CONTEXT_MESSAGES || 20),

      maxTokens: 12000,
    });

    const llmMessages = buildLLMMessages({
      systemPrompt: SYSTEM_PROMPT,

      summary: context.summary,

      memories: context.memories,

      state: this.state.getAll(),

      messages: context.messages,

      currentUserMessage: userMessage,
    });

    const response = await groq.chat.completions.create({
      model: MODEL,

      messages: llmMessages,

      temperature: 0.3,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("LLM returned empty response");
    }

    this.shortTermMemory.add({
      role: "user",
      content: userMessage,
    });

    this.shortTermMemory.add({
      role: "assistant",
      content: assistantMessage,
    });

    return {
      response: assistantMessage,

      memories,

      context: {
        estimatedTokens: context.estimatedTokens,

        messageCount: context.messages.length,
      },
    };
  }
}
