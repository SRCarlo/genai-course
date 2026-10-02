import { BaseProvider } from "./base-provider.js";

/**
 * Tertiary provider used for architecture/fallback testing.
 * Replace this adapter with another real AI provider when required.
 */
export class ProviderC extends BaseProvider {
  constructor({ handler = null } = {}) {
    super("provider-c");
    this.handler = handler;
  }

  async generate(request) {
    if (this.handler) {
      return this.handler(request);
    }

    return {
      provider: this.name,
      model: request.model,
      text: "Provider C fallback response (simulation).",
      usage: null,
      latencyMs: 0
    };
  }
}
