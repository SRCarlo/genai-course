export function calculateErrorRate(errors, requests) {
  if (requests === 0) return 0;
  return errors / requests;
}
