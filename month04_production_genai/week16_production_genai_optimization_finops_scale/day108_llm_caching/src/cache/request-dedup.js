export class RequestDeduplicator {
  constructor() {
    this.inFlight = new Map();
  }

  /**
   * Execute an operation only once when
   * multiple identical requests arrive
   * at the same time.
   */
  async execute(key, fn) {
    // If this request is already running,
    // return the existing promise.
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    // Start the operation.
    const promise = Promise.resolve().then(fn);

    // Store the in-flight promise.
    this.inFlight.set(key, promise);

    try {
      return await promise;
    } finally {
      // Remove after completion so future
      // requests can execute normally.
      this.inFlight.delete(key);
    }
  }

  /**
   * Alias used by the HTTP server.
   */
  async run(key, fn) {
    return this.execute(key, fn);
  }

  has(key) {
    return this.inFlight.has(key);
  }

  size() {
    return this.inFlight.size;
  }

  clear() {
    this.inFlight.clear();
  }
}