export const ERROR_TYPES = {
  INVALID_INPUT: "INVALID_INPUT",

  RATE_LIMITED: "RATE_LIMITED",

  NO_RELEVANT_CONTEXT: "NO_RELEVANT_CONTEXT",

  RETRIEVAL_ERROR: "RETRIEVAL_ERROR",

  LLM_TIMEOUT: "LLM_TIMEOUT",

  LLM_ERROR: "LLM_ERROR",

  OUTPUT_VALIDATION_ERROR: "OUTPUT_VALIDATION_ERROR",

  SOURCE_VALIDATION_ERROR: "SOURCE_VALIDATION_ERROR",

  CIRCUIT_OPEN: "CIRCUIT_OPEN",

  INTERNAL_ERROR: "INTERNAL_ERROR",
};

export class AppError extends Error {
  constructor(code, message, statusCode = 500) {
    super(message);

    this.name = "AppError";

    this.code = code;

    this.statusCode = statusCode;
  }
}
