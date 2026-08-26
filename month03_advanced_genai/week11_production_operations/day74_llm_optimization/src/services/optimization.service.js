import { getPrompt } from "../prompts/prompt.registry.js";
import { generateText } from "./llm.service.js";
import { calculateOptimizationStatus } from "../utils/metrics.js";

export async function runPromptExperiment({
  promptVersion,
  datasetItem,
  model,
  temperature = 0.3,
}) {
  const template = getPrompt(promptVersion);

  const systemPrompt = template
    .replace("{{input}}", datasetItem.input)
    .replace("{{context}}", "");

  const result = await generateText({
    systemPrompt,
    userInput: datasetItem.input,
    model,
    temperature,
    maxCompletionTokens: 300,
    reasoningEffort: "low",
  });

  return {
    promptVersion,
    datasetId: datasetItem.id,
    input: datasetItem.input,
    expected: datasetItem.expected,
    output: result.content,
    model: result.model,
    latencyMs: result.latencyMs,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    totalTokens: result.totalTokens,
    costPerRequest: result.costPerRequest,
  };
}

export function evaluateExperimentResult(result) {
  const normalizedOutput = result.output.toLowerCase().trim();

  const normalizedExpected = result.expected.toLowerCase().trim();

  let score = 0;

  if (normalizedOutput === normalizedExpected) {
    score = 1;
  } else {
    const expectedWords = normalizedExpected.split(/\s+/);

    const matchedWords = expectedWords.filter((word) =>
      normalizedOutput.includes(word),
    );

    score = matchedWords.length / expectedWords.length;
  }

  return {
    ...result,
    score,
  };
}

export function summarizeExperiment(results) {
  if (!results.length) {
    return {
      quality: 0,
      averageLatency: 0,
      averageCost: 0,
      totalCost: 0,
      accepted: false,
    };
  }

  const quality =
    results.reduce((sum, result) => sum + result.score, 0) / results.length;

  const averageLatency =
    results.reduce((sum, result) => sum + result.latencyMs, 0) / results.length;

  const averageCost =
    results.reduce((sum, result) => sum + result.costPerRequest, 0) /
    results.length;

  const totalCost = results.reduce(
    (sum, result) => sum + result.costPerRequest,
    0,
  );

  const status = calculateOptimizationStatus({
    quality,
    latencyMs: averageLatency,
    costPerRequest: averageCost,
  });

  return {
    quality,
    averageLatency,
    averageCost,
    totalCost,
    accepted: status.accepted,
    constraints: status,
  };
}
