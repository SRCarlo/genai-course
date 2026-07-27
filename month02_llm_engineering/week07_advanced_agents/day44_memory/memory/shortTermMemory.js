const messages = [];

export function saveMessage(message) {
  messages.push(message);
}

export function getMessages() {
  return messages;
}
