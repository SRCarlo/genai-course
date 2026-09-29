import crypto from "node:crypto";

function normalizeObject(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeObject);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = normalizeObject(value[key]);
        return result;
      }, {});
  }

  return value;
}

export function hashRequest(data) {
  const normalized = normalizeObject(data);

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}

export function createCacheKey({
  tenantId,
  userId = null,
  model,
  promptVersion,
  contextVersion,
  query,
  temperature = 0,
  language = "en",
}) {
  const payload = {
    tenantId,
    userId,
    model,
    promptVersion,
    contextVersion,
    query,
    temperature,
    language,
  };

  return `llm:${tenantId}:${hashRequest(payload)}`;
}
