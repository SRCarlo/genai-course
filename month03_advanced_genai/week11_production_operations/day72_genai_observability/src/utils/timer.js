export function startTimer() {
  return process.hrtime.bigint();
}

export function elapsedMs(start) {
  return Number(process.hrtime.bigint() - start) / 1_000_000;
}
