const sessions = new Map();

export function getHistory(sessionId) {
  if (!sessionId) {
    return [];
  }

  return sessions.get(sessionId) || [];
}

export function addMessage(sessionId, message) {
  if (!sessionId) {
    return;
  }

  const history = getHistory(sessionId);

  history.push(message);

  const MAX_MESSAGES = 20;

  const trimmed = history.slice(-MAX_MESSAGES);

  sessions.set(sessionId, trimmed);
}

export function clearHistory(sessionId) {
  sessions.delete(sessionId);
}
