import { LLMService } from "../llm/llm.service.js";
export class QueryRewriter {
  constructor({ llmService = new LLMService() } = {}) {
    this.llmService = llmService;
  }
  async rewrite({ question, conversation = [] }) {
    if (!conversation.length) return question;
    const context = conversation
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");
    const result = await this.llmService.complete({
      system:
        "Rewrite the latest user question into a standalone retrieval query. Preserve exact technical identifiers and return only the rewritten query.",
      user: `Conversation:\n${context}\n\nLatest question:\n${question}`,
      temperature: 0,
    });
    return result || question;
  }
}
