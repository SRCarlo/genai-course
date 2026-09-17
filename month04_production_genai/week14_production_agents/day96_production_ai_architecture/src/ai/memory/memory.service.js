const memoryStore = new Map();

export const memoryService = {
  get(userId) {
    return memoryStore.get(userId) || [];
  },

  add(userId, message) {
    const current = memoryStore.get(userId) || [];

    current.push(message);

    const limited = current.slice(-10);

    memoryStore.set(userId, limited);

    return limited;
  },

  clear(userId) {
    memoryStore.delete(userId);
  },
};
