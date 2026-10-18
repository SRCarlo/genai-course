const ABSTENTION_PATTERN =
  /\b(?:not specified|does not specify|don't know|do not know|cannot determine|can't determine|does not say|not provided|insufficient information|information provided does not)\b/i;

function assertValidCase(testCase) {
  if (!testCase || typeof testCase !== "object") {
    throw new TypeError("testCase must be an object");
  }
  if (typeof testCase.id !== "string" || testCase.id.trim() === "") {
    throw new TypeError("testCase.id must be a non-empty string");
  }
  if (typeof testCase.context !== "string") {
    throw new TypeError(`testCase.context must be a string (${testCase.id})`);
  }
  if (!Array.isArray(testCase.expectedAnswerContains) ||
      !testCase.expectedAnswerContains.every((term) => typeof term === "string")) {
    throw new TypeError(`expectedAnswerContains must be an array of strings (${testCase.id})`);
  }
  if (typeof testCase.shouldAbstain !== "boolean") {
    throw new TypeError(`shouldAbstain must be a boolean (${testCase.id})`);
  }
}

function calculateOverlapScore(context, answer) {
  const tokenize = (value) => value.toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);
  const contextTerms = [...new Set(tokenize(context))];
  if (contextTerms.length === 0) return 1;
  const answerTerms = new Set(tokenize(answer));
  const matched = contextTerms.filter((term) => answerTerms.has(term)).length;
  return Number((matched / contextTerms.length).toFixed(2));
}

export function evaluateAnswer(testCase, answer) {
  assertValidCase(testCase);
  if (typeof answer !== "string") {
    throw new TypeError("answer must be a string");
  }

  const normalizedAnswer = answer.toLocaleLowerCase("en");
  const expectedTermsPresent = testCase.expectedAnswerContains.every((term) =>
    normalizedAnswer.includes(term.toLocaleLowerCase("en"))
  );
  const abstained = ABSTENTION_PATTERN.test(answer);
  const abstentionCorrect = testCase.shouldAbstain ? abstained : !abstained;
  const groundednessScore = calculateOverlapScore(testCase.context, answer);
  const passed = expectedTermsPresent && abstentionCorrect;

  return {
    id: testCase.id,
    passed,
    expectedTermsPresent,
    abstained,
    abstentionCorrect,
    groundednessScore
  };
}
