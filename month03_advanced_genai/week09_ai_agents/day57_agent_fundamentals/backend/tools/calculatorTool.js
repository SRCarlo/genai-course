export const calculatorTool = {
  name: "calculator",

  description: "Calculate a mathematical expression.",

  schema: {
    type: "object",

    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression such as 125 * 48",
      },
    },

    required: ["expression"],
  },

  async execute({ expression }) {
    if (typeof expression !== "string") {
      throw new Error("Expression must be a string.");
    }

    const safeExpression = expression.trim();

    if (!/^[0-9+\-*/().%\s]+$/.test(safeExpression)) {
      throw new Error("Invalid mathematical expression.");
    }

    const result = Function(`"use strict"; return (${safeExpression})`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid calculation result.");
    }

    return {
      expression: safeExpression,
      result,
    };
  },
};
