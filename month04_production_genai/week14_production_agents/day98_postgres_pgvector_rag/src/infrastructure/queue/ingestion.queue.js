export class IngestionQueue {
  constructor() {
    this.jobs = [];
    this.worker = null;
    this.running = false;
  }

  setWorker(worker) {
    this.worker = worker;
  }

  async add(job) {
    this.jobs.push(job);
    queueMicrotask(() => this.drain());
    return job;
  }

  async drain() {
    if (this.running || !this.worker) return;

    this.running = true;

    try {
      while (this.jobs.length > 0) {
        const job = this.jobs.shift();
        await this.worker.process(job);
      }
    } finally {
      this.running = false;
    }
  }
}
