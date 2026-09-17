import { supportAgent } from "../ai/agents/support.agent.js";

import { database } from "../infrastructure/database/database.js";

export const chatService = {
  async execute({ userId, tenantId, message, conversationId }) {
    const result = await supportAgent.run({
      userId,
      tenantId,
      message,
    });

    const conversation = {
      id: conversationId || result.conversationId,

      userId,

      tenantId,

      lastMessage: message,

      lastResponse: result.answer,

      updatedAt: new Date().toISOString(),
    };

    await database.saveConversation(conversation);

    return result;
  },
};
