export function startTimer() {
  return process.hrtime.bigint();
}

export function elapsedMs(start) {
  const end = process.hrtime.bigint();
  return Number(end - start) / 1_000_000;
}

export async function measureAsync(task) {
  const start = startTimer();
  const result = await task();
  return { result, durationMs: elapsedMs(start) };
}
