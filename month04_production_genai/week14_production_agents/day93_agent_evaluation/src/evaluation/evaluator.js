import {
  requiredTermsCheck,
  forbiddenTermsCheck,
  refusalCheck,
  toolCheck,
  toolArgumentsCheck
} from "./rules.js";

export async function evaluateCase(testCase, result, options = {}) {
  const checks = {};
  const failures = [];

  checks.requiredTerms = requiredTermsCheck(
    result.output,
    testCase.expected.requiredTerms
  );

  checks.forbiddenTerms = forbiddenTermsCheck(
    result.output,
    testCase.expected.forbiddenTerms
  );

  checks.refusal = refusalCheck(
    result.output,
    testCase.expected.mustRefuse
  );

  checks.expectedTool = toolCheck(
    result.toolCalls,
    testCase.expected.expectedTool
  );

  checks.toolArguments = toolArgumentsCheck(
    result.toolCalls,
    testCase.expected.expectedTool,
    testCase.expected.expectedToolArgs
  );

  for (const [name, passed] of Object.entries(checks)) {
    if (!passed) failures.push(name);
  }

  let judge = null;
  if (options.useJudge) {
    try {
      judge = await options.judge({
        input: testCase.input,
        expected: testCase.expected,
        output: result.output,
        context: testCase.context
      });

      if (judge.overall < 3) {
        failures.push("llmJudgeOverallBelow3");
      }
    } catch (error) {
      failures.push(`judgeError: ${error.message}`);
    }
  }

  return {
    id: testCase.id,
    category: testCase.category,
    passed: failures.length === 0,
    failures,
    checks,
    output: result.output,
    toolCalls: result.toolCalls,
    latencyMs: result.latencyMs,
    usage: result.usage,
    judge
  };
}
