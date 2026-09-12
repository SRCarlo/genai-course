export class JobQueue {
  constructor() {
    this.jobs = [];
    this.running = false;
    this.worker = null;
  }

  enqueue(job) {
    this.jobs.push(job);
    this.#drain();
    return job.id;
  }

  size() {
    return this.jobs.length;
  }

  start(worker) {
    this.worker = worker;
    this.#drain();
  }

  async #drain() {
    if (this.running || !this.worker) return;

    this.running = true;

    try {
      while (this.jobs.length) {
        const job = this.jobs.shift();
        await this.worker(job);
      }
    } finally {
      this.running = false;
    }
  }
}
