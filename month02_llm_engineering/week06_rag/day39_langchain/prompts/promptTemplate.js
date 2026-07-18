import { PromptTemplate } from "@langchain/core/prompts";

const explainPrompt = PromptTemplate.fromTemplate(`
You are an expert AI teacher.

Explain the following topic in simple language.

Topic: {topic}

Explanation:
`);

export default explainPrompt;


