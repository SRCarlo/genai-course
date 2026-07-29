const blockedWords = ["password", "hack", "exploit", "malware", "database"];

export function validateInput(input) {
  if (!input || typeof input !== "string") {
    return false;
  }

  const text = input.toLowerCase();

  return !blockedWords.some((word) => text.includes(word));
}
