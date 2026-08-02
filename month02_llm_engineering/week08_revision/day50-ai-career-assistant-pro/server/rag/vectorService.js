import Vector from "../models/Vector.js";

export const saveVector = async (text, embedding, source) => {
  return await Vector.create({
    text,

    embedding,

    source,
  });
};
