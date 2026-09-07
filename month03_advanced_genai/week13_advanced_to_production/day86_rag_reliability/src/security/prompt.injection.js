const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,

  /ignore\s+(all\s+)?prior\s+instructions/i,

  /reveal\s+(the\s+)?system\s+prompt/i,

  /show\s+(me\s+)?the\s+system\s+message/i,

  /override\s+your\s+instructions/i,

  /forget\s+your\s+instructions/i,

  /disregard\s+previous/i,

  /act\s+as\s+system/i,

  /developer\s+message/i,
];

export function detectPromptInjection(text = "") {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeRetrievedContent(text = "") {
  return String(text).replace(/\0/g, "").trim();
}
