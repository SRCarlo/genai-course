export function evaluateAnswer(expected, generated) {
  if (!expected || !generated) {
    return {
      score: 0,
    };
  }

  const match = generated.toLowerCase().includes(expected.toLowerCase());

  return {
    score: match ? 1 : 0,

    faithfulness: match,

    answerRelevant: match,
  };
}
