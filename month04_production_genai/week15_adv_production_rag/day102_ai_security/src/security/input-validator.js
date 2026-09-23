export function validateQuestion(question) {
  if (typeof question !== "string") {
    throw new Error("Question must be a string");
  }

  const trimmed = question.trim();

  if (!trimmed) {
    throw new Error("Question cannot be empty");
  }

  if (trimmed.length > 2000) {
    throw new Error("Question exceeds maximum length");
  }

  return trimmed;
}
