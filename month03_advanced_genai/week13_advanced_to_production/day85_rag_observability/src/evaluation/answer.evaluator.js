import { tokenize } from "../retrieval/tokenizer.js";

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateContextRelevance({
  question,
  context
}) {
  const questionTokens =
    new Set(tokenize(question));

  const contextTokens =
    new Set(tokenize(context));

  if (questionTokens.size === 0) {
    return 0;
  }

  let matches = 0;

  for (const token of questionTokens) {
    if (contextTokens.has(token)) {
      matches++;
    }
  }

  return matches / questionTokens.size;
}

export function evaluateFaithfulness({
  answer,
  context
}) {
  const answerTokens =
    tokenize(answer);

  const contextTokens =
    new Set(tokenize(context));

  if (answerTokens.length === 0) {
    return 0;
  }

  const meaningfulTokens =
    answerTokens.filter(
      (token) => token.length > 2
    );

  if (!meaningfulTokens.length) {
    return 1;
  }

  const supported =
    meaningfulTokens.filter(
      (token) =>
        contextTokens.has(token)
    );

  return (
    supported.length /
    meaningfulTokens.length
  );
}

export function evaluateCorrectness({
  answer,
  expectedAnswer
}) {
  const normalizedAnswer =
    normalize(answer);

  const normalizedExpected =
    normalize(expectedAnswer);

  if (
    normalizedAnswer.includes(
      normalizedExpected
    )
  ) {
    return 1;
  }

  const expectedTokens =
    new Set(
      tokenize(expectedAnswer)
    );

  const answerTokens =
    new Set(
      tokenize(answer)
    );

  if (expectedTokens.size === 0) {
    return 0;
  }

  let matched = 0;

  for (const token of expectedTokens) {
    if (answerTokens.has(token)) {
      matched++;
    }
  }

  return (
    matched /
    expectedTokens.size
  );
}