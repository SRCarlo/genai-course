export class ProviderRouter {
  constructor(providers, healthRegistry = null) {
    this.providers = providers;
    this.healthRegistry = healthRegistry;
  }

  get(name) {
    const provider = this.providers[name];

    if (!provider) {
      throw new Error(`Provider not found: ${name}`);
    }

    return provider;
  }

  getHealthy(name) {
    const provider = this.get(name);

    if (this.healthRegistry && !this.healthRegistry.isHealthy(name)) {
      throw new Error(`Provider is unhealthy: ${name}`);
    }

    return provider;
  }
}
