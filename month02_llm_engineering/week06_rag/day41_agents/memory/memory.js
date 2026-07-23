const history = [];

export function saveMemory(data) {
  history.push(data);
}

export function getMemory() {
  return history;
}
