export function classifyError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("permission denied")) return "AUTHORIZATION";
  if (message.includes("authentication")) return "AUTHENTICATION";
  if (message.includes("invalid arguments")) return "VALIDATION";
  if (message.includes("unknown tool")) return "TOOL_NOT_FOUND";
  if (message.includes("timeout")) return "TIMEOUT";
  if (message.includes("rate limit")) return "RATE_LIMIT";
  if (message.includes("not found")) return "NOT_FOUND";

  return "INTERNAL";
}

export function publicErrorMessage() {
  return "I couldn't complete that request right now. Please try again.";
}
