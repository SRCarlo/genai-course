export function normalizeText(text = "") {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

export function exactMatch(actual, expected) {
  return normalizeText(actual) === normalizeText(expected);
}

export function exactMatchScore(actual, expected) {
  return exactMatch(actual, expected) ? 1 : 0;
}
