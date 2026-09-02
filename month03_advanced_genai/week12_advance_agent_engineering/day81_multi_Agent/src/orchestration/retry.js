export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(max = 250) {
  return Math.floor(Math.random() * max);
}

export async function retry(
  fn,
  {
    maxAttempts = 3,

    baseDelay = 1000,

    shouldRetry = () => true,

    onRetry = () => {},
  } = {},
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !shouldRetry(error)) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1) + jitter();

      await onRetry({
        attempt,

        error,

        delay,
      });

      await sleep(delay);
    }
  }

  throw lastError;
}

export function withTimeout(
  promise,
  timeoutMs,
  message = "Operation timed out",
) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),

    timeoutPromise,
  ]);
}
