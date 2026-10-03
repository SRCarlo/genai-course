export class ModelRouter {
  constructor(registry) {
    this.registry = registry;
  }
  select({ task, complexity }) {
    if (complexity === "high") return this.registry.get("quality");
    if (task === "chat") return this.registry.get("balanced");
    return this.registry.get("fast");
  }
}
