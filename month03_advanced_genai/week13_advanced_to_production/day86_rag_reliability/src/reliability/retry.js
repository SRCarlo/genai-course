function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableError(error) {
  const status = error?.status;

  if (!status) {
    return true;
  }

  return [429, 502, 503, 504].includes(status);
}

export async function retry(
  fn,
  maxAttempts = Number(process.env.LLM_MAX_RETRIES || 3),
) {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt === maxAttempts - 1) {
        break;
      }

      const baseDelay = 1000 * Math.pow(2, attempt);

      const jitter = Math.floor(Math.random() * 250);

      await sleep(baseDelay + jitter);
    }
  }

  throw lastError;
}
