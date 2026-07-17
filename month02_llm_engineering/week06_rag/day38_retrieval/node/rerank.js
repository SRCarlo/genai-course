export default function rerank(results, question) {
  const query = question.toLowerCase();

  return results

    .map((doc) => {
      let bonus = 0;

      if (doc.text.toLowerCase().includes(query)) {
        bonus += 0.05;
      }

      return {
        ...doc,

        score: doc.score + bonus,
      };
    })

    .sort((a, b) => b.score - a.score);
}
