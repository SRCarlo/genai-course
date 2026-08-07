export async function measure(name, fn) {
  const start = performance.now();

  const result = await fn();

  const end = performance.now();

  console.log(`${name}: ${(end - start).toFixed(2)} ms`);

  return result;
}
