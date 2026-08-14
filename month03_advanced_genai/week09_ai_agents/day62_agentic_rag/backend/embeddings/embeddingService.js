import { pipeline } from "@huggingface/transformers";

const MODEL = process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    console.log(`Loading embedding model: ${MODEL}`);

    extractorPromise = pipeline("feature-extraction", MODEL);
  }

  return extractorPromise;
}

export async function createEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error("Text is required for embedding");
  }

  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return output.tolist()[0];
}

export async function createEmbeddings(texts) {
  if (!Array.isArray(texts)) {
    throw new Error("texts must be an array");
  }

  if (texts.length === 0) {
    return [];
  }

  const extractor = await getExtractor();

  const output = await extractor(texts, {
    pooling: "mean",
    normalize: true,
  });

  return output.tolist();
}
