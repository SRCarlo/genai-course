import { ProviderA } from "./provider-a.js";

export class ProviderB extends ProviderA {
  constructor(options = {}) {
    super(options);
    this.name = "groq-fallback";
  }
}
