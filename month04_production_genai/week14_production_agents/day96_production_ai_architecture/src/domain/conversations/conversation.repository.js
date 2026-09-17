import { database } from "../../infrastructure/database/database.js";

export const conversationRepository = {
  async save(conversation) {
    return database.saveConversation(conversation);
  },

  async findById(id) {
    return database.getConversation(id);
  },

  async findAll() {
    return database.getAllConversations();
  },
};
