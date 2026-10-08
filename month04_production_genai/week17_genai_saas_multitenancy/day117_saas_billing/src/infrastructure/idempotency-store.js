export class IdempotencyStore {
  constructor() {
    this.processed = new Set();
  }

  async has(key) {
    return this.processed.has(key);
  }

  async mark(key) {
    this.processed.add(key);
  }
}
