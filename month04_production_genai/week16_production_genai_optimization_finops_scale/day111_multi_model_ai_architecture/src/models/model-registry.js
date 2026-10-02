import { models } from "./model-config.js";

export class ModelRegistry {
  get(name) {
    const model = models[name];

    if (!model) {
      throw new Error(`Unknown model tier: ${name}`);
    }

    return { tier: name, ...model };
  }

  list() {
    return Object.entries(models).map(([name, config]) => ({
      tier: name,
      ...config
    }));
  }

  findEligible({ maxCostTier = "high", requiredCapabilities = {} } = {}) {
    const maxCost = {
      low: 1,
      medium: 2,
      high: 3
    }[maxCostTier];

    if (!maxCost) {
      throw new Error(`Invalid maxCostTier: ${maxCostTier}`);
    }

    return this.list().filter((model) => {
      const withinCost = {
        low: 1,
        medium: 2,
        high: 3
      }[model.costTier] <= maxCost;

      const capabilitiesMatch = Object.entries(requiredCapabilities).every(
        ([capability, required]) =>
          !required || model.capabilities?.[capability] === true
      );

      return withinCost && capabilitiesMatch;
    });
  }
}
