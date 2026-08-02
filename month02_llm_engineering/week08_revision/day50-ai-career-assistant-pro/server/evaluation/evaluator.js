export const evaluateResponse = (response) => {
  return {
    characters: response.length,

    words: response.split(" ").length,

    empty: response.length === 0,

    timestamp: new Date(),
  };
};
