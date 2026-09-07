export async function withTimeout(
  operation,
  timeoutMs = Number(process.env.LLM_TIMEOUT_MS || 10000),
) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await operation(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}
