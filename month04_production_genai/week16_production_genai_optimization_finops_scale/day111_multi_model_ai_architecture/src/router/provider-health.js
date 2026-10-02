export class ProviderHealth {
  constructor() {
    this.status = {};
  }

  set(provider, healthy) {
    this.status[provider] = Boolean(healthy);
  }

  isHealthy(provider) {
    return this.status[provider] !== false;
  }

  snapshot() {
    return { ...this.status };
  }
}
