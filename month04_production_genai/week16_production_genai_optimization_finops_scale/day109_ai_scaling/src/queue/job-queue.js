export class JobQueue {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(job) {
    if (this.size >= this.maxSize) {
      const error = new Error("Queue is full");
      error.code = "QUEUE_FULL";
      throw error;
    }

    this.items.push(job);
  }

  shift() {
    return this.items.shift();
  }

  snapshot() {
    return {
      size: this.size,
      maxSize: this.maxSize
    };
  }
}
