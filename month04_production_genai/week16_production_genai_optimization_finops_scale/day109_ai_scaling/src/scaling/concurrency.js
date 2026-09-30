export class ConcurrencyLimiter {
  constructor(limit) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("Concurrency limit must be >= 1");
    }

    this.limit = limit;
    this.active = 0;
    this.queue = [];
    this.maxObserved = 0;
  }

  async run(task) {
    if (this.active >= this.limit) {
      await new Promise((resolve, reject) => {
        this.queue.push({ resolve, reject });
      });
    }

    this.active++;
    this.maxObserved = Math.max(this.maxObserved, this.active);

    try {
      return await task();
    } finally {
      this.active--;

      const next = this.queue.shift();
      if (next) {
        next.resolve();
      }
    }
  }

  stats() {
    return {
      limit: this.limit,
      active: this.active,
      waiting: this.queue.length,
      maxObserved: this.maxObserved
    };
  }
}
