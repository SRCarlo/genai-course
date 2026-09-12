export class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  subscribe(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }

    this.handlers.get(event).push(handler);
  }

  async publish(event, payload) {
    const handlers = this.handlers.get(event) || [];

    for (const handler of handlers) {
      await handler(payload);
    }
  }
}
