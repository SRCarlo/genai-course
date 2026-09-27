export function canRetry(
  retryCount,
  maxRetries = 2
) {
  return retryCount < maxRetries;
}

export function isRetryableError(error) {
  const status = error?.status;

  if (status === 408 || status === 429) return true;
  if (status >= 500 && status <= 599) return true;

  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("temporarily")
  );
}

export async function withRetry(
  operation,
  {
    maxRetries = 2,
    shouldRetry = isRetryableError,
    delayMs = 100
  } = {}
) {
  let retryCount = 0;

  while (true) {
    try {
      const result = await operation({ retryCount });

      return {
        result,
        retryCount
      };
    } catch (error) {
      if (
        retryCount >= maxRetries ||
        !shouldRetry(error)
      ) {
        throw error;
      }

      retryCount += 1;

      if (delayMs > 0) {
        await new Promise(resolve =>
          setTimeout(resolve, delayMs)
        );
      }
    }
  }
}