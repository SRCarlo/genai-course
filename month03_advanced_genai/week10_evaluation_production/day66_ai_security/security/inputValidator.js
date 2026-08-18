export function validateInput(input) {
  if (typeof input !== "string") {
    return {
      valid: false,
      reason: "Input must be a string",
    };
  }

  const trimmed = input.trim();

  if (!trimmed) {
    return {
      valid: false,
      reason: "Input cannot be empty",
    };
  }

  if (trimmed.length > 5000) {
    return {
      valid: false,
      reason: "Input too long",
    };
  }

  return {
    valid: true,
    value: trimmed,
  };
}
