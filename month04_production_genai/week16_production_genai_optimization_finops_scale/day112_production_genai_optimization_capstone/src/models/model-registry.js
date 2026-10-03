export class ModelRegistry {
  constructor(model = "openai/gpt-oss-20b") {
    this.models = Object.freeze({
      fast: { provider: "provider-a", model, costTier: "low" },
      balanced: { provider: "provider-a", model, costTier: "medium" },
      quality: { provider: "provider-a", model, costTier: "high" },
    });
  }
  get(name) {
    const value = this.models[name];
    if (!value) throw new Error(`Unknown model: ${name}`);
    return value;
  }
  list() {
    return this.models;
  }
}
