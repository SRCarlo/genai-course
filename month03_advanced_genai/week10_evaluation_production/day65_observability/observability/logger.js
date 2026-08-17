function sanitizeValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/gsk_[A-Za-z0-9_-]+/g, "[GROQ_API_KEY_REDACTED]");
}

function sanitizeObject(object) {
  if (!object || typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(sanitizeObject);
  }

  const result = {};

  for (const [key, value] of Object.entries(object)) {
    const sensitiveKeys = [
      "apiKey",
      "authorization",
      "password",
      "secret",
      "token",
    ];

    if (
      sensitiveKeys.some((sensitive) =>
        key.toLowerCase().includes(sensitive.toLowerCase()),
      )
    ) {
      result[key] = "[REDACTED]";
      continue;
    }

    if (value && typeof value === "object") {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = sanitizeValue(value);
    }
  }

  return result;
}

export function log(level, event, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),

    level,

    event,

    ...sanitizeObject(data),
  };

  console.log(JSON.stringify(logEntry));
}

export function info(event, data = {}) {
  log("info", event, data);
}

export function error(event, data = {}) {
  log("error", event, data);
}
