import fs from "fs";
import cosineSimilarity from "../node/search.js";

const vectorStore = [];

// Load documents
function loadDocuments() {

    const documents = JSON.parse(
        fs.readFileSync("../data/documents.json", "utf-8")
    );

    for (const document of documents) {

        // Temporary embeddings for learning
        const embedding = [
            Math.random(),
            Math.random(),
            Math.random()
        ];

        vectorStore.push({
            document,
            embedding
        });
    }

    console.log(`Loaded ${vectorStore.length} documents.`);
}


// Search documents
function search(query) {

    // Temporary query embedding
    const queryEmbedding = [
        Math.random(),
        Math.random(),
        Math.random()
    ];


    const results = vectorStore.map((item) => {

        return {
            id: item.document.id,
            text: item.document.text,
            score: cosineSimilarity(
                queryEmbedding,
                item.embedding
            )
        };

    });


    results.sort((a, b) => b.score - a.score);


    return results.slice(0, 3);

}


// Main
function main(){

    loadDocuments();


    const query = "JavaScript server runtime";


    const results = search(query);


    console.log("\nQuery:");
    console.log(query);


    console.log("\nTop 3 Results:");
    console.table(results);

}


main();