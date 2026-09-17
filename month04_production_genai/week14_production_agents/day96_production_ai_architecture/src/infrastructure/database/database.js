const conversations = new Map();

export const database = {
  async saveConversation(conversation) {
    conversations.set(conversation.id, conversation);

    return conversation;
  },

  async getConversation(id) {
    return conversations.get(id) || null;
  },

  async getAllConversations() {
    return Array.from(conversations.values());
  },
};
