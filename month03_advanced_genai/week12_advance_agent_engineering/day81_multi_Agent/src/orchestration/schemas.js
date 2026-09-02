import { z } from "zod";

export const AgentResultSchema = z.object({
  success: z.boolean(),

  agent: z.string(),

  data: z.any().nullable(),

  nextAgent: z.string().nullable(),

  error: z.string().nullable(),
});

export const HandoffSchema = z.object({
  id: z.string(),

  type: z.string(),

  from: z.string(),

  to: z.string(),

  task: z.string(),

  context: z.record(z.string(), z.any()),

  result: z.any().nullable(),

  createdAt: z.string(),
});

export const ReviewSchema = z.object({
  approved: z.boolean(),

  issues: z.array(z.string()),

  suggestions: z.array(z.string()),
});

export function validateAgentResult(result) {
  return AgentResultSchema.parse(result);
}

export function validateHandoff(handoff) {
  return HandoffSchema.parse(handoff);
}

export function validateReview(review) {
  return ReviewSchema.parse(review);
}
