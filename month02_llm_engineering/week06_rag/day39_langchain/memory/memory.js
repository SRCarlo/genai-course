const history = [];

export function addMessage(role, content) {
  history.push({
    role,
    content,
  });
}

export function getHistory() {
  return history;
}

export function clearHistory() {
  history.length = 0;
}
