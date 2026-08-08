export function normalizeQuery(query) {
  if (typeof query !== "string") {
    return "";
  }

  return query.trim().replace(/\s+/g, " ");
}

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
