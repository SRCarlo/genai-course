export default function topK(results, k = 3) {
  return [...results].sort((a, b) => b.score - a.score).slice(0, k);
}
