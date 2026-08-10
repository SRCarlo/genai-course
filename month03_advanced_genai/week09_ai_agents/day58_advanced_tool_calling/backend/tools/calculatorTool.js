function validateExpression(expression) {

  if (
    typeof expression !== "string" ||
    expression.trim() === ""
  ) {
    throw new Error(
      "Expression must be a non-empty string"
    );
  }


  const cleanExpression =
    expression.trim();


  const allowedCharacters =
    /^[0-9+\-*/().\s]+$/;


  if (!allowedCharacters.test(cleanExpression)) {

    throw new Error(
      "Expression contains unsupported characters"
    );

  }


  return cleanExpression;
}


function calculateExpression(expression) {

  const cleanExpression =
    validateExpression(expression);


  // Basic arithmetic parser.
  // Supports:
  //
  // +
  // -
  // *
  // /
  // parentheses
  //
  // Example:
  // 125 * 48


  const tokens =
    cleanExpression.match(
      /\d+(?:\.\d+)?|[+\-*/()]/
    );


  if (!tokens) {

    throw new Error(
      "Invalid mathematical expression"
    );

  }


  // For Day 58, use a simple
  // operator-precedence parser.

  let index = 0;


  function parseExpression() {

    let value =
      parseTerm();


    while (
      index < cleanExpression.length
    ) {

      const operator =
        cleanExpression[index];


      if (
        operator !== "+" &&
        operator !== "-"
      ) {
        break;
      }


      index++;


      const right =
        parseTerm();


      if (operator === "+") {
        value += right;
      } else {
        value -= right;
      }

    }


    return value;
  }


  function skipSpaces() {

    while (
      index < cleanExpression.length &&
      /\s/.test(
        cleanExpression[index]
      )
    ) {
      index++;
    }

  }


  function parseTerm() {

    skipSpaces();


    let value =
      parseFactor();


    while (true) {

      skipSpaces();


      const operator =
        cleanExpression[index];


      if (
        operator !== "*" &&
        operator !== "/"
      ) {
        break;
      }


      index++;


      const right =
        parseFactor();


      if (operator === "*") {

        value *= right;

      } else {

        if (right === 0) {

          throw new Error(
            "Cannot divide by zero"
          );

        }

        value /= right;

      }

    }


    return value;
  }


  function parseFactor() {

    skipSpaces();


    if (
      cleanExpression[index] === "("
    ) {

      index++;


      const value =
        parseExpression();


      skipSpaces();


      if (
        cleanExpression[index] !== ")"
      ) {

        throw new Error(
          "Missing closing parenthesis"
        );

      }


      index++;


      return value;
    }


    const start = index;


    while (
      index < cleanExpression.length &&
      /[0-9.]/.test(
        cleanExpression[index]
      )
    ) {
      index++;
    }


    const number =
      cleanExpression.slice(
        start,
        index
      );


    if (!number) {

      throw new Error(
        "Expected a number"
      );

    }


    const value =
      Number(number);


    if (!Number.isFinite(value)) {

      throw new Error(
        "Invalid number"
      );

    }


    return value;
  }


  const result =
    parseExpression();


  skipSpaces();


  if (
    index !== cleanExpression.length
  ) {

    throw new Error(
      "Invalid mathematical expression"
    );

  }


  return result;
}


export const calculatorTool = {

  async execute({
    expression
  }) {

    const value =
      calculateExpression(expression);


    return {
      expression,
      value
    };

  }

};