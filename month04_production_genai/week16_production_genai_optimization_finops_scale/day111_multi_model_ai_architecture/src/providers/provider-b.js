import { BaseProvider } from "./base-provider.js";

/**
 * Secondary provider used to demonstrate provider abstraction and fallback.
 * Replace this adapter with another real AI provider when you add one.
 */
export class ProviderB extends BaseProvider {
  constructor({ handler = null } = {}) {
    super("provider-b");
    this.handler = handler;
  }

  async generate(request) {
    if (this.handler) {
      return this.handler(request);
    }

    return {
      provider: this.name,
      model: request.model,
      text: "Provider B fallback response (simulation).",
      usage: null,
      latencyMs: 0
    };
  }
}
