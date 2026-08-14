export async function calculatorTool(input) {
  const { expression } = input;

  if (!expression) {
    throw new Error("expression is required");
  }

  /*
   * Basic calculator for the Day 62 project.
   *
   * Only allow numbers and basic mathematical operators.
   */
  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
    throw new Error("Invalid mathematical expression");
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid calculation result");
    }

    return {
      expression,
      result,
    };
  } catch (error) {
    throw new Error("Unable to calculate expression");
  }
}
