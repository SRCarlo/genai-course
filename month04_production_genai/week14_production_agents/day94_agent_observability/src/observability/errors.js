export function classifyError(error) {
  if (!error) return "UNKNOWN_ERROR";

  if (error.code === "ETIMEDOUT" || error.name === "TimeoutError") {
    return "TIMEOUT";
  }

  if (error.status === 401 || error.status === 403) {
    return "AUTH_ERROR";
  }

  if (error.status === 429) {
    return "RATE_LIMIT";
  }

  if (error.name === "ValidationError") {
    return "VALIDATION_ERROR";
  }

  if (error.name === "SyntaxError") {
    return "PARSING_ERROR";
  }

  if (error.code?.startsWith("TOOL_")) {
    return "TOOL_ERROR";
  }

  if (error.code?.startsWith("LLM_")) {
    return "LLM_ERROR";
  }

  return "UNKNOWN_ERROR";
}

export class ObservabilityError extends Error {
  constructor(message, { code = "UNKNOWN", status, cause } = {}) {
    super(message);
    this.name = "ObservabilityError";
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}
