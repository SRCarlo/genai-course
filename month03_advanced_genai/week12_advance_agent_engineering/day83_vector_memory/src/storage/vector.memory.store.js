export class VectorMemoryStore {
  constructor() {
    this.memories = [];
  }

  add(memory) {
    if (!memory.id) {
      throw new Error("Memory id is required");
    }

    this.memories.push(memory);

    return memory;
  }

  getAll() {
    return [...this.memories];
  }

  getById(id) {
    return this.memories.find((memory) => memory.id === id);
  }

  update(id, updates) {
    const index = this.memories.findIndex((memory) => memory.id === id);

    if (index === -1) {
      return null;
    }

    this.memories[index] = {
      ...this.memories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.memories[index];
  }

  delete(id) {
    const originalLength = this.memories.length;

    this.memories = this.memories.filter((memory) => memory.id !== id);

    return this.memories.length < originalLength;
  }

  clear() {
    this.memories = [];
  }

  count() {
    return this.memories.length;
  }
}
