function normalizeToolName(tool) {
  if (typeof tool === "string") {
    return tool;
  }

  return tool?.name ?? tool?.function?.name ?? tool?.tool ?? "";
}

export function normalizeTools(tools = []) {
  return tools.map(normalizeToolName).filter(Boolean);
}

export function evaluateAgent({
  expectedTools = [],
  actualTools = [],
  maxIterations = 8,
  actualIterations = 0,
}) {
  const expected = normalizeTools(expectedTools);

  const actual = normalizeTools(actualTools);

  const exactSequence = JSON.stringify(expected) === JSON.stringify(actual);

  const sameTools =
    expected.length === actual.length &&
    expected.every((tool) => actual.includes(tool));

  const unnecessaryToolCalls = Math.max(0, actual.length - expected.length);

  const iterationWithinLimit = actualIterations <= maxIterations;

  return {
    expectedTools: expected,
    actualTools: actual,

    toolSelectionCorrect: sameTools ? 1 : 0,

    trajectoryCorrect: exactSequence ? 1 : sameTools ? 0.75 : 0,

    unnecessaryToolCalls,

    actualIterations,

    iterationWithinLimit,

    toolEfficiency:
      expected.length === 0
        ? actual.length === 0
          ? 1
          : 0
        : Math.min(1, expected.length / Math.max(actual.length, 1)),
  };
}
