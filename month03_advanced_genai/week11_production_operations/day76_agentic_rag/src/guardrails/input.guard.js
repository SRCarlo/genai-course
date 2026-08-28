const MAX_INPUT_LENGTH = 4000;

export function validateInput(message) {
  if (typeof message !== "string" || message.trim().length === 0) {
    return {
      valid: false,
      error: "Message is required.",
    };
  }

  if (message.length > MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: "Message exceeds the maximum allowed length.",
    };
  }

  return {
    valid: true,
    message: message.trim(),
  };
}
