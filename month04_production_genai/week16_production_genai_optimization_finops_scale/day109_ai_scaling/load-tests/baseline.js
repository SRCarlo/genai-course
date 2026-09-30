import { runLoad } from "./utils.js";

const report = await runLoad({
  totalRequests: 100,
  concurrency: 10
});

console.log("DAY 109 BASELINE");
console.table(report);
