const SENSITIVE_KEYS = new Set([
  "password",
  "apiKey",
  "api_key",
  "authorization",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "clientSecret",
  "groqApiKey",
]);

export function redactObject(object) {
  if (!object || typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(redactObject);
  }

  const result = {};

  for (const [key, value] of Object.entries(object)) {
    if (SENSITIVE_KEYS.has(key)) {
      result[key] = "[REDACTED]";
      continue;
    }

    if (value && typeof value === "object") {
      result[key] = redactObject(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function safeTextMetadata(text) {
  if (typeof text !== "string") {
    return {
      length: 0,
    };
  }

  return {
    length: text.length,
  };
}
