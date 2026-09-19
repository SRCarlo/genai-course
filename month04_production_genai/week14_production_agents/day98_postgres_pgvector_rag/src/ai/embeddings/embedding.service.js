import { pipeline } from "@huggingface/transformers";
import { config } from "../../config/config.js";

let extractorPromise;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", config.EMBEDDING_MODEL);
  }
  return extractorPromise;
}

export class EmbeddingService {
  async embed(text) {
    const extractor = await getExtractor();

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true
    });

    const vector = Array.from(output.data);

    if (vector.length !== config.EMBEDDING_DIMENSION) {
      throw new Error(
        `EMBEDDING_DIMENSION_MISMATCH: expected ${config.EMBEDDING_DIMENSION}, got ${vector.length}`
      );
    }

    return vector;
  }

  async embedMany(texts) {
    const vectors = [];
    for (const text of texts) {
      vectors.push(await this.embed(text));
    }
    return vectors;
  }
}
