import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import cosineSimilarity from "../node/similarity.js";
import documents from "../data/documents.json" with { type: "json" };

dotenv.config({
    path: "../.env"
});

const hf = new HfInference(process.env.HF_TOKEN);

async function embedding(text) {
    const result = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: text,
    });

    return result;
}


async function semanticSearch(query) {

    const queryEmbedding = await embedding(query);

    let bestDoc = null;
    let bestScore = -1;

    for (const doc of documents) {

        const docEmbedding = await embedding(doc.text);

        const score = cosineSimilarity(
            queryEmbedding,
            docEmbedding
        );

        console.log(
            doc.text,
            "=>",
            score
        );

        if (score > bestScore) {
            bestScore = score;
            bestDoc = doc;
        }
    }

    console.log("\nMost Similar:");
    console.log(bestDoc);
    console.log("Score:", bestScore);
}


semanticSearch("JavaScript server runtime");