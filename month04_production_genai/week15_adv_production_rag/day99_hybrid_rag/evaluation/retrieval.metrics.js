export function recallAtK(results, relevantDocuments, k) {
  const ids = new Set(results.slice(0, k).map((r) => r.documentId || r.id));
  if (!relevantDocuments.length) return 0;
  return (
    relevantDocuments.filter((id) => ids.has(id)).length /
    relevantDocuments.length
  );
}
export function precisionAtK(results, relevantDocuments, k) {
  const top = results.slice(0, k);
  if (!top.length) return 0;
  const set = new Set(relevantDocuments);
  return top.filter((r) => set.has(r.documentId || r.id)).length / top.length;
}
export function reciprocalRank(results, relevantDocuments) {
  const set = new Set(relevantDocuments);
  const i = results.findIndex((r) => set.has(r.documentId || r.id));
  return i === -1 ? 0 : 1 / (i + 1);
}
export function mean(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}
