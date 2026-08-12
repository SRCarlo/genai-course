function assertNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
}

export async function calculatorTool(input = {}) {
  const operation = input.operation;

  switch (operation) {
    case "sum": {
      if (!Array.isArray(input.values)) {
        throw new Error("sum requires a values array");
      }

      if (input.values.length === 0) {
        throw new Error("values cannot be empty");
      }

      input.values.forEach((value, index) => {
        assertNumber(value, `values[${index}]`);
      });

      return input.values.reduce((total, value) => total + value, 0);
    }

    case "divide": {
      assertNumber(input.a, "a");

      assertNumber(input.b, "b");

      if (input.b === 0) {
        throw new Error("Cannot divide by zero");
      }

      return input.a / input.b;
    }

    case "add": {
      assertNumber(input.a, "a");

      assertNumber(input.b, "b");

      return input.a + input.b;
    }

    case "subtract": {
      assertNumber(input.a, "a");

      assertNumber(input.b, "b");

      return input.a - input.b;
    }

    case "multiply": {
      assertNumber(input.a, "a");

      assertNumber(input.b, "b");

      return input.a * input.b;
    }

    default:
      throw new Error(`Unsupported calculator operation: ${operation}`);
  }
}
