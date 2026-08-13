export async function calculatorTool(input) {
  const expression = input?.expression;

  if (!expression || typeof expression !== "string") {
    throw new Error("Calculator requires an expression");
  }

  const allowedPattern = /^[0-9+\-*/().%\s]+$/;

  if (!allowedPattern.test(expression)) {
    throw new Error("Invalid calculator expression");
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid calculation result");
    }

    return {
      type: "tool_result",

      tool: "calculator",

      expression,

      result,
    };
  } catch (error) {
    throw new Error(`Calculator error: ${error.message}`);
  }
}
