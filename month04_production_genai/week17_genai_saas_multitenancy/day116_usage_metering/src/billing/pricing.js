// Groq pricing for openai/gpt-oss-20b.
// Keep provider pricing in one configuration file so it can be updated independently.
export const MODEL_PRICING = Object.freeze({
  "openai/gpt-oss-20b": Object.freeze({
    inputPerMillion: 0.075,
    outputPerMillion: 0.30
  })
});
