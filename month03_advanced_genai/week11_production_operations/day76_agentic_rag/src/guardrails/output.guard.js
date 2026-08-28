export function validateOutput(answer) {
  if (typeof answer !== "string" || answer.trim().length === 0) {
    return {
      valid: false,
      error: "Agent produced an empty response.",
    };
  }

  if (answer.length > 10000) {
    return {
      valid: false,
      error: "Agent response exceeds maximum output length.",
    };
  }

  return {
    valid: true,
    answer: answer.trim(),
  };
}
