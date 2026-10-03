export async function fallback(operations) {
  let lastError;
  for (const operation of operations) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
