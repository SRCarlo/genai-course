import { z } from "zod";

export const AgentResultSchema = z.object({
  agent: z.string(),

  status: z.enum(["completed", "failed", "timeout"]),

  confidence: z.number().min(0).max(1).optional(),

  result: z.any().optional(),

  error: z.string().optional(),

  sources: z.array(z.string()).optional(),
});

export function validateAgentResult(result) {
  return AgentResultSchema.parse(result);
}
