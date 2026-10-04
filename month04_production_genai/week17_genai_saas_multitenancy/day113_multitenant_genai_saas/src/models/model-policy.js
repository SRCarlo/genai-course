const modelAliases = Object.freeze({
  fast: "openai/gpt-oss-20b",
  balanced: "openai/gpt-oss-20b",
  quality: "openai/gpt-oss-20b"
});

export class ModelPolicy {
  canUse(policy, modelAlias) {
    return policy.allowedModels.includes(modelAlias);
  }

  resolve(modelAlias) {
    const model = modelAliases[modelAlias];

    if (!model) {
      throw new Error(`Unknown model alias: ${modelAlias}`);
    }

    return model;
  }

  validate(policy, modelAlias) {
    if (!this.canUse(policy, modelAlias)) {
      throw new Error(`Model ${modelAlias} is not allowed for this tenant`);
    }

    return this.resolve(modelAlias);
  }

  listAliases() {
    return Object.entries(modelAliases).map(([alias, model]) => ({
      alias,
      model
    }));
  }
}