export function calculateHitAtK(retrieved, expected, k) {
  const topK = retrieved.slice(0, k);

  return topK.some((doc) => expected.includes(doc));
}

export function calculateRecallAtK(retrieved, expected, k) {
  const topK = retrieved.slice(0, k);

  const found = expected.filter((doc) => topK.includes(doc));

  return found.length / expected.length;
}

export function calculateReciprocalRank(retrieved, expected) {
  const index = retrieved.findIndex((doc) => expected.includes(doc));

  if (index === -1) return 0;

  return 1 / (index + 1);
}
