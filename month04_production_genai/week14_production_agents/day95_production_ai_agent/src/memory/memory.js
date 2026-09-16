const sessions = new Map();

export function createMemory(sessionId = "default") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

export function addMessage(memory, message) {
  memory.push({
    ...message,
    timestamp: new Date().toISOString()
  });

  // Keep short-term memory bounded.
  if (memory.length > 20) {
    memory.splice(0, memory.length - 20);
  }
}

export function getMessages(memory) {
  return [...memory];
}

export function clearMemory(sessionId = "default") {
  sessions.delete(sessionId);
}
