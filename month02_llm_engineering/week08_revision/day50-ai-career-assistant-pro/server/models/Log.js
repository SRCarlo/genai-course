import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  endpoint: String,

  method: String,

  duration: Number,

  status: Number,

  prompt: String,

  response: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Log", logSchema);
