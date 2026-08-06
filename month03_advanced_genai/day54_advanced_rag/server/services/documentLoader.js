import fs from "fs";
import path from "path";

const DOCUMENT_FOLDER = path.join(process.cwd(), "data", "documents");

export function loadDocuments() {
  const files = fs.readdirSync(DOCUMENT_FOLDER);

  const docs = files.map((file) => {
    const text = fs.readFileSync(path.join(DOCUMENT_FOLDER, file), "utf-8");

    return {
      id: file,

      source: file,

      text,

      category: "backend",

      language: "javascript",

      framework: file.includes("express") ? "express" : "general",
    };
  });

  return docs;
}
