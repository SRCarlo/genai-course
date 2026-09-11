export async function withTimeout(promise, timeoutMs) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error("Operation timed out");

      error.code = "TIMEOUT";

      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
