export function deduplicate(results) {
  const seen = new Set();
  return results.filter((result) => {
    if (seen.has(result.id)) return false;
    seen.add(result.id);
    return true;
  });
}
