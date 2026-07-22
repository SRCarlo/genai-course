const history = [];

export function addMessage(role, content) {
  history.push({
    role,

    content,

    time: new Date(),
  });
}

export function getHistory() {
  return history;
}

export function clearHistory() {
  history.length = 0;
}
