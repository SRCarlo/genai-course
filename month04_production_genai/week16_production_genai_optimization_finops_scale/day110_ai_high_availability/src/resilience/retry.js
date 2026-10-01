export async function retry(
  task,
  { retries = 3, baseDelay = 200, shouldRetry = () => true } = {},
) {
  let attempt = 0;
  while (true) {
    try {
      return await task();
    } catch (error) {
      if (!shouldRetry(error) || attempt >= retries) throw error;
      const delay = baseDelay * 2 ** attempt + Math.floor(Math.random() * 100);
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
}
