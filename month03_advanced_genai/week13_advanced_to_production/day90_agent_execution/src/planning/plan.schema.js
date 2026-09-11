import { z } from "zod";

export const planStepSchema = z.object({
  id: z.string(),

  tool: z.enum(["getOrder", "checkRefundEligibility", "refundOrder"]),

  arguments: z.record(z.string(), z.unknown()),

  status: z.enum(["pending", "running", "completed", "failed", "skipped"]),

  dependsOn: z.array(z.string()).default([]),
});

export const planSchema = z.array(planStepSchema);

export function validatePlan(plan) {
  return planSchema.parse(plan);
}
