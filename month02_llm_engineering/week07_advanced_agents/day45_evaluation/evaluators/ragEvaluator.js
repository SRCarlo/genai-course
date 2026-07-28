export function evaluateRAG(context, answer) {
  const found = context.toLowerCase().includes(answer.toLowerCase());

  return {
    contextPrecision: found ? 100 : 0,

    answerCorrect: found,
  };
}
