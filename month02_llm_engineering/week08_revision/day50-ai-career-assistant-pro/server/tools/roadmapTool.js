import { generateAIResponse } from "../services/groqService.js";

export const roadmapTool = async (goal) => {
  const systemPrompt = `
You are an AI career mentor.

Create a detailed learning roadmap.
`;

  return await generateAIResponse(systemPrompt, goal);
};
