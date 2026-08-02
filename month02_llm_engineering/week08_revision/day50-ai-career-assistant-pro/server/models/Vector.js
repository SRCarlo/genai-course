import mongoose from "mongoose";

const vectorSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    source: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Vector", vectorSchema);
