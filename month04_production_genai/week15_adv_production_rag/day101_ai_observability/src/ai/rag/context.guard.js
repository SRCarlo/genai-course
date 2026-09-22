export function validateContextSize(tokenCount, maxTokens) {
  if (!Number.isFinite(tokenCount))
    throw new Error("Invalid context token count.");
  if (!Number.isFinite(maxTokens))
    throw new Error("Invalid maximum context token limit.");
  if (tokenCount > maxTokens)
    throw new Error(`Context exceeds ${maxTokens} tokens`);
  return true;
}
