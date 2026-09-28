export class ConcurrencyLimiter {
  constructor(limit) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error("Concurrency limit must be a positive integer");
    }

    this.limit = limit;
    this.active = 0;
    this.queue = [];
  }

  get activeCount() {
    return this.active;
  }

  get queuedCount() {
    return this.queue.length;
  }

  async run(task) {
    if (this.active >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.active++;

    try {
      return await task();
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}
