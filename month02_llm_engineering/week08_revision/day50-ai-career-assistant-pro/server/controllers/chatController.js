import { retrieveContext } from "../rag/ragService.js";

import { generateAIResponse } from "../services/groqService.js";

import { getHistory, saveMessage } from "../memory/memoryService.js";

export const chat = async (req, res) => {
  try {
    const { sessionId, question } = req.body;

    // Load previous conversation
    const history = await getHistory(sessionId);

    const previousConversation = history
      .map((item) => `${item.role}: ${item.content}`)
      .join("\n");

    // Retrieve RAG context
    const context = await retrieveContext(question);

    // Build system prompt
    const systemPrompt = `
You are an AI Career Assistant.

Previous Conversation:

${previousConversation}

Knowledge Base:

${context}

Answer the user's latest question.
`;

    // Generate AI response
    const answer = await generateAIResponse(systemPrompt, question);

    // Save user message
    await saveMessage(sessionId, "user", question);

    // Save AI response
    await saveMessage(sessionId, "assistant", answer);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
