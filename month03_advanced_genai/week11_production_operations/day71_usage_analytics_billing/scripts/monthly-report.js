import {
  getMonthlyAnalytics,
  getModelAnalytics,
  getTenantAnalytics,
  getOverview,
} from "../src/services/analytics.service.js";

const overview = getOverview();

const monthly = getMonthlyAnalytics();

const models = getModelAnalytics();

const tenants = getTenantAnalytics();

console.log(
  "\n_______________________ MONTHLY AI REPORT ____________________\n",
);

console.log("Monthly:", JSON.stringify(monthly, null, 2));

console.log("\nOverview:");

console.log(JSON.stringify(overview, null, 2));

console.log("\nMost Expensive Models:");

console.log(JSON.stringify(models, null, 2));

console.log("\nHighest Usage Tenants:");

console.log(JSON.stringify(tenants, null, 2));

console.log("\n_____________________________________________________\n");
