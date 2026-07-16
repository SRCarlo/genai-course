const fs = require("fs");
const path = require("path");

const fixedChunk = require("../node/fixed");
const recursiveChunk = require("../node/recursive");
const slidingChunk = require("../node/sliding");
const semanticChunk = require("../node/semantic");

const CHUNK_FILE = path.join(__dirname, "../chunks/chunks.json");

/*
    Save chunks into JSON file
*/

function saveChunks(chunks) {
  fs.writeFileSync(
    CHUNK_FILE,

    JSON.stringify(chunks, null, 2),
  );
}

/*
    Read stored chunks
*/

function getChunks() {
  if (!fs.existsSync(CHUNK_FILE)) {
    return [];
  }

  const data = fs.readFileSync(
    CHUNK_FILE,

    "utf-8",
  );

  return JSON.parse(data);
}

/*
    Add common metadata
*/

function addMetadata(chunks, source = "document.txt") {
  return chunks.map((chunk, index) => {
    return {
      id: index + 1,

      text: chunk.text,

      metadata: {
        ...chunk.metadata,

        source,

        createdAt: new Date().toISOString(),

        characters: chunk.text.length,
      },
    };
  });
}

/*
    Main Chunk Service
*/

function createChunks(text, type = "recursive", source = "document.txt") {
  let chunks = [];

  switch (type) {
    case "fixed":
      chunks = fixedChunk(text, 500);

      break;

    case "recursive":
      chunks = recursiveChunk(text);

      break;

    case "sliding":
      chunks = slidingChunk(text, 50, 10);

      break;

    case "semantic":
      chunks = semanticChunk(text);

      break;

    default:
      throw new Error("Invalid chunk type");
  }

  const finalChunks = addMetadata(chunks, source);

  saveChunks(finalChunks);

  return finalChunks;
}

/*
    Read Document File
*/

function readDocument(filePath) {
  return fs.readFileSync(
    filePath,

    "utf-8",
  );
}

module.exports = {
  createChunks,

  saveChunks,

  getChunks,

  readDocument,
};

/*
    Test Service Directly
*/

if (require.main === module) {
  const file = path.join(__dirname, "../data/document.txt");

  const text = readDocument(file);

  const result = createChunks(text, "recursive", "document.txt");

  console.log("Created Chunks:", result);
}
