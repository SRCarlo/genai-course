export class ShortTermMemory {
  constructor(maxMessages = 20) {
    this.messages = [];
    this.maxMessages = maxMessages;
  }

  add(message) {
    if (!message || !message.role || !message.content) {
      throw new Error("Invalid message");
    }

    this.messages.push(message);

    while (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  addMany(messages) {
    for (const message of messages) {
      this.add(message);
    }
  }

  getAll() {
    return [...this.messages];
  }

  getRecent(count = 10) {
    return this.messages.slice(-count);
  }

  size() {
    return this.messages.length;
  }

  clear() {
    this.messages = [];
  }
}
