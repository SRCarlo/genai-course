export async function measure(
  operation,
  fn
) {
  const start = performance.now();

  try {
    const result = await fn();

    return {
      result,
      operation,
      latencyMs:
        Math.round(
          performance.now() - start
        ),
      error: null
    };
  } catch (error) {
    return {
      result: null,
      operation,
      latencyMs:
        Math.round(
          performance.now() - start
        ),
      error
    };
  }
}