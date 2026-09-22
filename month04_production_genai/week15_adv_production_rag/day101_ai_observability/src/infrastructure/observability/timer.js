export function startTimer() {
  const startedAt = performance.now();
  return {
    elapsed() {
      return Number((performance.now() - startedAt).toFixed(2));
    },
  };
}
