import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Conversation", conversationSchema);
