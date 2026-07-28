export function calculateScore(correct, total) {
  return Number(((correct / total) * 100).toFixed(2));
}
