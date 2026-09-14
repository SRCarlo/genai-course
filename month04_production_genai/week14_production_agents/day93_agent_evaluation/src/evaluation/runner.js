import { evaluateCase } from "./evaluator.js";

export async function runEvaluation(agent, dataset, options = {}) {
  const results = [];

  for (const testCase of dataset) {
    const start = Date.now();

    try {
      const output = await agent(testCase.input, testCase.context);

      const latencyMs = Date.now() - start;

      const result = await evaluateCase(
        testCase,
        {
          output: output.output,
          toolCalls: output.toolCalls || [],
          usage: output.usage || {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0
          },
          latencyMs
        },
        options
      );

      results.push(result);
    } catch (error) {
      results.push({
        id: testCase.id,
        category: testCase.category,
        passed: false,
        failures: [`agentError: ${error.message}`],
        checks: {},
        output: "",
        toolCalls: [],
        latencyMs: Date.now() - start,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0
        }
      });
    }
  }

  return results;
}
