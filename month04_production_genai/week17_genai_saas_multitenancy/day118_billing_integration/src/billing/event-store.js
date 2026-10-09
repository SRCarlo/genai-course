export class InMemoryEventStore {
  #events = new Map();

  async recordReceived(provider, event) {
    const key = `${provider}:${event.id}`;
    const existing = this.#events.get(key);

    if (existing) {
      return { duplicate: true, event: structuredClone(existing) };
    }

    const record = {
      provider,
      id: event.id,
      type: event.type,
      data: structuredClone(event.data),
      status: "received",
      attempts: 0,
      lastError: null,
      receivedAt: new Date().toISOString(),
      processedAt: null
    };

    this.#events.set(key, record);
    return { duplicate: false, event: structuredClone(record) };
  }

  async markProcessing(provider, eventId) {
    const event = this.#events.get(`${provider}:${eventId}`);
    if (!event) throw new Error("EVENT_NOT_FOUND");
    event.status = "processing";
    event.attempts += 1;
  }

  async markProcessed(provider, eventId) {
    const event = this.#events.get(`${provider}:${eventId}`);
    if (!event) throw new Error("EVENT_NOT_FOUND");
    event.status = "processed";
    event.lastError = null;
    event.processedAt = new Date().toISOString();
  }

  async markFailed(provider, eventId, error) {
    const event = this.#events.get(`${provider}:${eventId}`);
    if (!event) throw new Error("EVENT_NOT_FOUND");
    event.status = "failed";
    event.lastError = String(error?.message ?? error).slice(0, 1000);
  }

  async get(provider, eventId) {
    const event = this.#events.get(`${provider}:${eventId}`);
    return event ? structuredClone(event) : undefined;
  }
}
