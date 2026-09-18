export function cleanText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text.replace(/\s+/g, " ").trim();
}
