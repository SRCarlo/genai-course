import { retrieveContext } from "../rag/ragService.js";
import { generateAIResponse } from "../services/groqService.js";

export const ragTool = async (question) => {
  const context = await retrieveContext(question);

  const systemPrompt = `
You are an AI Career Assistant.

Answer only using the provided context.

Context:

${context}
`;

  return await generateAIResponse(systemPrompt, question);
};
