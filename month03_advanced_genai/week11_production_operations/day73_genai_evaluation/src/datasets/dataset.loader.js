import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../");

export async function loadDataset(datasetName) {
  const filePath = path.join(projectRoot, "datasets", `${datasetName}.json`);

  const raw = await fs.readFile(filePath, "utf-8");

  return JSON.parse(raw);
}
