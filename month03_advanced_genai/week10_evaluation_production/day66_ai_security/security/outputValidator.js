import { redactSecrets } from "./piiRedactor.js";

export function validateOutput(output) {
  if (typeof output !== "string") {
    return {
      valid: false,
      reason: "Invalid output",
    };
  }

  if (output.length > 10000) {
    return {
      valid: false,
      reason: "Output too long",
    };
  }

  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*\S+/i,
    /password\s*[:=]\s*\S+/i,
    /secret\s*[:=]\s*\S+/i,
    /access[_-]?token\s*[:=]\s*\S+/i,
    /auth[_-]?token\s*[:=]\s*\S+/i,
    /bearer\s+[a-z0-9._-]+/i,
    /sk-[a-zA-Z0-9_-]+/i,
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(output)) {
      return {
        valid: false,
        reason: "Sensitive information detected",
      };
    }
  }

  return {
    valid: true,
    output,
  };
}

export function sanitizeOutput(output) {
  if (typeof output !== "string") {
    return "";
  }

  return redactSecrets(output);
}
