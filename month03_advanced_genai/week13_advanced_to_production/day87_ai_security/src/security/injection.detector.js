const suspiciousPatterns = [
  /ignore\s+(all|any|the)\s+previous\s+instructions/i,
  /ignore\s+your\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /show\s+(me\s+)?your\s+system\s+prompt/i,
  /developer\s+message/i,
  /bypass\s+(your\s+)?rules/i,
  /disregard\s+(all\s+)?instructions/i,
  /forget\s+(all\s+)?previous\s+instructions/i,
  /override\s+(the\s+)?system/i,
  /print\s+(your\s+)?hidden\s+instructions/i
];

export function detectPromptInjection(text) {
  const matches = suspiciousPatterns.filter((pattern) => pattern.test(text));

  return {
    suspicious: matches.length > 0,
    matchCount: matches.length,
    reasons: matches.map((pattern) => pattern.source)
  };
}

const sensitiveRequests = [
  "system prompt",
  "developer prompt",
  "hidden instructions",
  "internal instructions"
];

export function isSensitivePromptRequest(text) {
  const normalized = text.toLowerCase();
  return sensitiveRequests.some((item) => normalized.includes(item));
}
