export function llmFallback(error = null) {
  return {
    answer:
      "The AI service is temporarily unavailable. Please try again later.",
    fallback: true,
    errorCategory: error?.name || "LLM_FAILURE",
  };
}

export function retrievalFallback() {
  return {
    answer:
      "The knowledge service is temporarily unavailable. Please try again later.",
    sources: [],
    fallback: true,
  };
}

export function authorizationFallback() {
  return {
    allowed: false,
    fallback: true,
    reason: "Authorization service unavailable; access denied.",
  };
}
