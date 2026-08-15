import { calculatorTool } from "../tools/calculatorTool.js";

describe("Calculator Tool", () => {
  test("adds two numbers", () => {
    const result = calculatorTool({
      a: 10,
      b: 20,
      operation: "add",
    });

    expect(result).toBe(30);
  });

  test("subtracts two numbers", () => {
    const result = calculatorTool({
      a: 30,
      b: 10,
      operation: "subtract",
    });

    expect(result).toBe(20);
  });

  test("multiplies two numbers", () => {
    const result = calculatorTool({
      a: 10,
      b: 20,
      operation: "multiply",
    });

    expect(result).toBe(200);
  });

  test("divides two numbers", () => {
    const result = calculatorTool({
      a: 100,
      b: 4,
      operation: "divide",
    });

    expect(result).toBe(25);
  });

  test("calculates percentage", () => {
    const result = calculatorTool({
      a: 80000,
      b: 15,
      operation: "percentage",
    });

    expect(result).toBe(12000);
  });

  test("throws error when dividing by zero", () => {
    expect(() =>
      calculatorTool({
        a: 100,
        b: 0,
        operation: "divide",
      }),
    ).toThrow("Cannot divide by zero");
  });

  test("throws error for unsupported operation", () => {
    expect(() =>
      calculatorTool({
        a: 10,
        b: 20,
        operation: "power",
      }),
    ).toThrow("Unsupported operation");
  });

  test("rejects non-number input", () => {
    expect(() =>
      calculatorTool({
        a: "100",
        b: 20,
        operation: "add",
      }),
    ).toThrow("Calculator inputs must be numbers");
  });
});
