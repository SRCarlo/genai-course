import Conversation from "../models/Conversation.js";

export const saveMessage = async (sessionId, role, content) => {
  return await Conversation.create({
    sessionId,
    role,
    content,
  });
};

export const getHistory = async (sessionId, limit = 10) => {
  return await Conversation.find({
    sessionId,
  })
    .sort({
      createdAt: 1,
    })
    .limit(limit);
};
