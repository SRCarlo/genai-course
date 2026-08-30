const memoryStore = new Map();

export function saveMemory(userId, key, value) {
  if (!userId || !key) {
    throw new Error("userId and key are required");
  }

  if (!memoryStore.has(userId)) {
    memoryStore.set(userId, {});
  }

  const userMemory = memoryStore.get(userId);

  userMemory[key] = value;

  memoryStore.set(userId, userMemory);

  return userMemory;
}

export function getMemory(userId) {
  return memoryStore.get(userId) || {};
}

export function deleteMemory(userId, key) {
  const userMemory = memoryStore.get(userId);

  if (!userMemory) {
    return false;
  }

  delete userMemory[key];

  return true;
}
