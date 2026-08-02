import { pipeline } from "@xenova/transformers";

let extractor;

const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",

      "Xenova/all-MiniLM-L6-v2",
    );
  }

  return extractor;
};

export const createEmbedding = async (text) => {
  const model = await getExtractor();

  const output = await model(
    text,

    {
      pooling: "mean",

      normalize: true,
    },
  );

  return Array.from(output.data);
};
