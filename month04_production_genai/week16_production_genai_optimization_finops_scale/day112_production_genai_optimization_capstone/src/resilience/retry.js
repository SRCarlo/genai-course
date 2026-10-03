const retryableStatus = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
export function isRetryableError(error) {
  return (
    error?.code === "ETIMEDOUT" ||
    retryableStatus.has(error?.status) ||
    ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND"].includes(error?.code)
  );
}
export async function retry(
  operation,
  { attempts = 2, delayMs = 250, shouldRetry = isRetryableError } = {},
) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i >= attempts - 1 || !shouldRetry(error)) throw error;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastError;
}
