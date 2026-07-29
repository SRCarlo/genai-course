const suspiciousPatterns = [
  "ignore previous instructions",
  "ignore all previous instructions",
  "forget your rules",
  "reveal system prompt",
  "show system prompt",
  "act as system",
  "pretend you are",
  "developer mode",
  "bypass safety",
  "disable safety",
  "ignore safety",
  "jailbreak",
  "you are now",
  "system prompt",
  "override instructions",
];

export function detectPromptInjection(input) {
  if (!input || typeof input !== "string") {
    return false;
  }

  const text = input.toLowerCase();

  return suspiciousPatterns.some((pattern) => text.includes(pattern));
}
