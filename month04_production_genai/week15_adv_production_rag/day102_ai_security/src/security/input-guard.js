const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?previous\s+instructions/i,
  /forget\s+(the\s+)?rules\s+above/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /show\s+(me\s+)?your\s+system\s+instructions/i,
];

export function runInputGuardrails(question) {
  if (typeof question !== "string") {
    return { allowed: false, reason: "INVALID_INPUT_TYPE" };
  }

  const normalized = question.trim();

  if (normalized.length === 0) {
    return { allowed: false, reason: "EMPTY_INPUT" };
  }

  if (normalized.length > 2000) {
    return { allowed: false, reason: "INPUT_TOO_LONG" };
  }

  const matchedPattern = SUSPICIOUS_PATTERNS.find((pattern) =>
    pattern.test(normalized),
  );

  if (matchedPattern) {
    return {
      allowed: false,
      reason: "PROMPT_INJECTION_PATTERN",
    };
  }

  return { allowed: true };
}
