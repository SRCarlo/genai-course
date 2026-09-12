export const RETRYABLE_CODES = new Set([
  "TIMEOUT",
  "RATE_LIMIT",
  "NETWORK_ERROR",
  "SERVICE_UNAVAILABLE",
  "GROQ_ERROR"
]);

export function isRetryable(error) {
  return Boolean(error?.retryable || RETRYABLE_CODES.has(error?.code));
}

export function calculateBackoff(attempt, baseMs = 250) {
  const exponential = baseMs * (2 ** attempt);
  const jitter = Math.floor(Math.random() * 250);
  return exponential + jitter;
}

export async function withRetry(operation, {
  maxRetries = 3,
  shouldRetry = isRetryable,
  onRetry = () => {}
} = {}) {
  let attempt = 0;

  while (true) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const delay = calculateBackoff(attempt);
      await onRetry({ attempt: attempt + 1, delay, error });
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt += 1;
    }
  }
}
