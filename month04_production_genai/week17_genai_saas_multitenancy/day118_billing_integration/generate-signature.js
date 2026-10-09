import "dotenv/config";
import { config } from "./src/config/config.js";
import { signPayload } from "./src/webhooks/signature.js";

const body = JSON.stringify({
  id: "evt_test_002",
  type: "subscription.activated",
  data: {
    tenantId: "tenant_1",
    subscriptionId: "sub_1",
    planId: "pro",
    version: 1
  }
});

console.log("BODY:", body);
console.log(
  "SIGNATURE:",
  signPayload(body, config.webhookSecret)
);