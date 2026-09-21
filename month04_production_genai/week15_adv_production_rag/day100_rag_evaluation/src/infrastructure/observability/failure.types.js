export const FailureType = Object.freeze({
  INVALID_INPUT: "INVALID_INPUT",
  NO_RELEVANT_CONTEXT: "NO_RELEVANT_CONTEXT",
  RETRIEVAL_ERROR: "RETRIEVAL_ERROR",
  RERANKER_ERROR: "RERANKER_ERROR",
  LLM_TIMEOUT: "LLM_TIMEOUT",
  LLM_ERROR: "LLM_ERROR",
  OUTPUT_VALIDATION_ERROR: "OUTPUT_VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export function classifyFailure(error) {
  if (!error) return null;

  const message = String(error.message || "").toLowerCase();

  if (message.includes("timeout")) return FailureType.LLM_TIMEOUT;
  if (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("api key")
  ) {
    return FailureType.LLM_ERROR;
  }

  return FailureType.UNKNOWN_ERROR;
}
