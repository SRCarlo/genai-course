import { askGroq } from "./groq-client.js";
import { canProcessData } from "../governance/data-policy.js";
import { getApprovalDecision } from "../governance/approval.js";

const requestedData = "INTERNAL";
const action = "DRAFT_EMAIL";

if (!canProcessData(requestedData)) {
  throw new Error(`Governance blocked data classification: ${requestedData}`);
}

const decision = getApprovalDecision(action);

if (decision === "DENIED") {
  throw new Error(`Governance denied action: ${action}`);
}

const answer = await askGroq(
  "Explain AI governance in three concise bullet points for a software engineer."
);

console.log("\nGovernance checks");
console.log("-----------------");
console.log(`Data classification: ${requestedData} -> allowed`);
console.log(`Action: ${action} -> ${decision}`);
console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);

console.log("\nGroq response");
console.log("-------------");
console.log(answer);
