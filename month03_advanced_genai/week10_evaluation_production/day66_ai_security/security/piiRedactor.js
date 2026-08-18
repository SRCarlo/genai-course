export function redactSecrets(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .replace(/api[_-]?key\s*[:=]\s*\S+/gi, "api_key=[REDACTED]")
    .replace(/password\s*[:=]\s*\S+/gi, "password=[REDACTED]")
    .replace(/secret\s*[:=]\s*\S+/gi, "secret=[REDACTED]")
    .replace(/access[_-]?token\s*[:=]\s*\S+/gi, "access_token=[REDACTED]")
    .replace(/auth[_-]?token\s*[:=]\s*\S+/gi, "auth_token=[REDACTED]")
    .replace(/bearer\s+[a-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/sk-[a-zA-Z0-9_-]+/g, "sk-[REDACTED]");
}

export function redactPII(text) {
  if (typeof text !== "string") {
    return "";
  }

  return redactSecrets(text).replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    "[EMAIL_REDACTED]",
  );
}
