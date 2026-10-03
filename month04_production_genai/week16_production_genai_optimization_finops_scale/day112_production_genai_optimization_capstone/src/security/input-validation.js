export function validateGenerateRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Invalid request body");
  if (typeof body.prompt !== "string" || body.prompt.trim().length === 0)
    throw new Error("prompt is required");
  if (body.prompt.length > 10000) throw new Error("prompt is too long");
  const allowedComplexity = new Set(["low", "medium", "high"]);
  const complexity = body.complexity || "medium";
  if (!allowedComplexity.has(complexity))
    throw new Error("complexity must be low, medium, or high");
  return {
    prompt: body.prompt.trim(),
    task:
      typeof body.task === "string" && body.task.trim()
        ? body.task.trim()
        : "chat",
    complexity,
    systemPrompt:
      typeof body.systemPrompt === "string"
        ? body.systemPrompt.slice(0, 5000)
        : undefined,
    temperature:
      body.temperature === undefined ? undefined : Number(body.temperature),
  };
}
