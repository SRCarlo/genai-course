export const RETRYABLE_ERRORS = [
  "TIMEOUT",
  "RATE_LIMIT",
  "SERVICE_UNAVAILABLE",
  "NETWORK_ERROR",
];

export function isRetryableError(error) {
  return RETRYABLE_ERRORS.includes(error.code);
}

export async function withRetry(
  operation,
  { retries = 2, delayMs = 300 } = {},
) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }

  throw lastError;
}
