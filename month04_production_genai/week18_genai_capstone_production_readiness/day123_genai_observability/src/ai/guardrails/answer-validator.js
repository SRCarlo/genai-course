export function validateAnswer(answer, sources) {
  if (typeof answer !== 'string' || !answer.trim()) {
    return { valid: false, reason: 'EMPTY_ANSWER' };
  }
  if (!Array.isArray(sources) || sources.length === 0) {
    return { valid: false, reason: 'NO_SUPPORTING_SOURCES' };
  }
  return { valid: true, answer: answer.trim() };
}
