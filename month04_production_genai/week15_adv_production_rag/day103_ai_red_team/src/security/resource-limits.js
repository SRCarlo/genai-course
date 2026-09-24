export const LIMITS = {
  MAX_INPUT_LENGTH: 8000,
  MAX_CONTEXT_SIZE: 12000,
  MAX_TOOL_CALLS: 10,
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT_MS: 10000
};

export function validateInputLength(input) {
  return String(input ?? "").length <= LIMITS.MAX_INPUT_LENGTH;
}

export function validateContextSize(context) {
  return String(context ?? "").length <= LIMITS.MAX_CONTEXT_SIZE;
}

export function assertToolCallLimit(toolCalls) {
  if (toolCalls >= LIMITS.MAX_TOOL_CALLS) {
    throw new Error("Maximum tool calls exceeded");
  }
}

export function assertRetryLimit(retries) {
  if (retries >= LIMITS.MAX_RETRIES) {
    throw new Error("Maximum retries exceeded");
  }
}

export async function withTimeout(promise, timeoutMs = LIMITS.REQUEST_TIMEOUT_MS) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Request timeout")),
      timeoutMs
    );
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
