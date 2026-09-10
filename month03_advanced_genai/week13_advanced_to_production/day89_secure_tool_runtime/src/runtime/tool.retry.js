export async function retryTool(
  fn,
  {
    maxAttempts = 3,
    shouldRetry = () => true,
    baseDelayMs = 500
  } = {}
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (
        attempt === maxAttempts ||
        !shouldRetry(error)
      ) {
        break;
      }

      const delay =
        baseDelayMs * Math.pow(2, attempt - 1);

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw lastError;
}