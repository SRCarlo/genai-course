const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "what",
  "how",
  "why",
  "does",
  "do",
  "of",
  "to",
  "in",
  "on",
  "for",
  "and",
  "or",
  "with",
  "can",
  "be",
  "from",
  "this",
  "that"
]);

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));
}