import { spawn } from "node:child_process";

const child = spawn(
  process.execPath,
  ["--test", "tests/security/security.test.js"],
  {
    stdio: "inherit",
  },
);

child.on("error", (error) => {
  console.error("Failed to start security tests:");
  console.error(error);
  process.exit(1);
});

child.on("close", (code) => {
  process.exit(code ?? 1);
});
