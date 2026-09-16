import fs from "node:fs/promises";

export async function loadDataset(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}
