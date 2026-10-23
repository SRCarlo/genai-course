const { createHash } = require("node:crypto");

function createResponseCacheKey({
  tenantId,
  authorizationScope,
  question,
  model,
  promptVersion,
  indexVersion,
  locale = "en",
}) {
  const required = {
    tenantId,
    authorizationScope,
    question,
    model,
    promptVersion,
    indexVersion,
  };

  for (const [name, value] of Object.entries(required)) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new TypeError(`${name} must be a non-empty string`);
    }
  }

  const canonicalInput = JSON.stringify({
    tenantId,
    authorizationScope,
    question: question.trim().replace(/\s+/g, " "),
    model,
    promptVersion,
    indexVersion,
    locale,
  });

  return createHash("sha256").update(canonicalInput).digest("hex");
}

module.exports = { createResponseCacheKey };
