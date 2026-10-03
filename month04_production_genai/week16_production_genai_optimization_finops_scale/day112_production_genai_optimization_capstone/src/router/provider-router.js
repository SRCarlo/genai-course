export class ProviderRouter {
  constructor(providers) {
    this.providers = providers;
  }
  get(name) {
    const provider = this.providers[name];
    if (!provider) throw new Error(`Provider not found: ${name}`);
    return provider;
  }
  list() {
    return Object.keys(this.providers);
  }
}
