import { groqProvider } from "./provider.adapter.js";

export class LLMService {
  constructor(provider) {
    this.provider = provider;
  }

  async generate(messages, options = {}) {
    return this.provider.generate(messages, options);
  }
}

export const llmService = new LLMService(groqProvider);
