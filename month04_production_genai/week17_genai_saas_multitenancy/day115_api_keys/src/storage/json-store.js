import fs from "node:fs/promises";
import path from "node:path";

export async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(
    tempPath,
    JSON.stringify(value, null, 2),
    "utf8"
  );
  await fs.rename(tempPath, filePath);
}
