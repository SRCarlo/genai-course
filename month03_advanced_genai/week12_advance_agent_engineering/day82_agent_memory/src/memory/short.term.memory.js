export class ShortTermMemory {
  constructor(maxMessages = 20) {
    this.messages = [];
    this.maxMessages = maxMessages;
  }

  add(message) {
    if (!message || !message.role || !message.content) {
      throw new Error("Invalid message");
    }

    this.messages.push({
      role: message.role,
      content: message.content,
      createdAt: new Date().toISOString(),
    });

    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getAll() {
    return [...this.messages];
  }

  getRecent(limit = 10) {
    return this.messages.slice(-limit);
  }

  clear() {
    this.messages = [];
  }

  size() {
    return this.messages.length;
  }
}
