export class ModelRouter {
  constructor(registry) {
    this.registry = registry;
  }

  select({
    task = "general",
    complexity = "medium",
    maxCostTier = "high",
    requiredCapabilities = {}
  } = {}) {
    const eligible = this.registry.findEligible({
      maxCostTier,
      requiredCapabilities
    });

    if (eligible.length === 0) {
      throw new Error("No model satisfies the requested capabilities/cost policy");
    }

    if (complexity === "high") {
      const quality = eligible.find((model) => model.tier === "quality");
      if (quality) return quality;
    }

    if (task === "chat" || complexity === "medium") {
      const balanced = eligible.find((model) => model.tier === "balanced");
      if (balanced) return balanced;
    }

    const fast = eligible.find((model) => model.tier === "fast");
    if (fast) return fast;

    return eligible[0];
  }
}
