import fs from "fs/promises";
import path from "path";

export async function loadDocument(filePath) {
  const content = await fs.readFile(filePath, "utf-8");

  return {
    filePath,
    fileName: path.basename(filePath),
    content,
  };
}

export async function loadDocuments(directory) {
  const files = await fs.readdir(directory);

  const supportedFiles = files.filter((file) =>
    [".txt", ".md"].includes(path.extname(file).toLowerCase()),
  );

  const documents = [];

  for (const file of supportedFiles) {
    const filePath = path.join(directory, file);

    const document = await loadDocument(filePath);

    documents.push(document);
  }

  return documents;
}
