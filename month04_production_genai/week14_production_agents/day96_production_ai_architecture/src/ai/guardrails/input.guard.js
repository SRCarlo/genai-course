const MAX_MESSAGE_LENGTH = 4000;

const blockedPatterns = [
  /ignore\s+previous\s+instructions/i,
  /reveal\s+your\s+system\s+prompt/i,
  /show\s+me\s+your\s+api\s+key/i,
];

export function validateInput(message) {
  if (!message) {
    throw new Error("Message is required.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error("Message exceeds the maximum allowed length.");
  }

  const blocked = blockedPatterns.some((pattern) => pattern.test(message));

  if (blocked) {
    throw new Error("This request cannot be processed.");
  }

  return true;
}
