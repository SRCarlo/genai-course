import { generateAIResponse } from "../services/groqService.js";

export const resumeTool = async (resumeText) => {
  const systemPrompt = `
You are an expert resume reviewer.

Return ONLY valid JSON.

{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;

  return await generateAIResponse(systemPrompt, resumeText, true);
};
