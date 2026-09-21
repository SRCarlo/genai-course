const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "am",
  "to",
  "of",
  "and",
  "or",
  "for",
  "in",
  "on",
  "with",
  "how",
  "what",
  "why",
  "do",
  "i",
  "my",
  "it",
  "can",
  "be",
  "should",
  "does",
  "from",
  "this",
  "that",
  "use",
]);

export function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s@_-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));
}
