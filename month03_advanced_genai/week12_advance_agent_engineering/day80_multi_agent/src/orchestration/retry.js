export async function executeWithRetry(
  fn,
  maxRetries,
  onRetry
) {
  let lastError;

  for (
    let attempt = 0;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      if (onRetry) {
        onRetry({
          attempt: attempt + 1,
          error
        });
      }
    }
  }

  throw lastError;
}
