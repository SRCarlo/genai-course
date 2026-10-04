import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set(["node_modules", ".git", "coverage"]);
const allowedFiles = /\.(js|mjs|cjs|json|md|yml|yaml|env|example|txt)$/i;

const patterns = [
  /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}["']/i,
  /(?:GROQ_API_KEY|OPENAI_API_KEY)\s*=\s*[^\s#]{8,}/i,
  /(?:sk|gsk)_[A-Za-z0-9_-]{12,}/,
  /Bearer\s+[A-Za-z0-9_-]{16,}/i
];

const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!allowedFiles.test(entry.name) || entry.name === ".env") continue;

    const content = fs.readFileSync(fullPath, "utf8");
    content.split(/\r?\n/).forEach((line, index) => {
      if (line.trimStart().startsWith("#")) return;
      if (patterns.some((pattern) => pattern.test(line))) {
        findings.push(`${path.relative(root, fullPath)}:${index + 1}`);
      }
    });
  }
}

walk(root);

if (findings.length) {
  console.error("Potential hardcoded secret detected:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Secret scan passed: no hardcoded secret patterns found.");
