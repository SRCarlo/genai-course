export async function withTimeout(
  promise,
  timeoutMs = 10000
) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("TOOL_TIMEOUT");
      error.code = "TOOL_TIMEOUT";

      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      promise,
      timeout
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}