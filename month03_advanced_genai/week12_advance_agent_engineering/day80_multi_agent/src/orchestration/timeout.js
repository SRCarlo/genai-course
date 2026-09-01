export function withTimeout(
  promise,
  timeoutMs,
  message = "Agent execution timed out"
) {
  let timeoutId;

  const timeout = new Promise(
    (_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(message)
        );
      }, timeoutMs);
    }
  );

  return Promise.race([
    promise.finally(() => {
      clearTimeout(timeoutId);
    }),

    timeout
  ]);
}
