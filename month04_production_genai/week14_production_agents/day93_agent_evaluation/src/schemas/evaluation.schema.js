import { z } from "zod";

export const EvaluationExpectedSchema = z.object({
  requiredTerms: z.array(z.string()).default([]),
  forbiddenTerms: z.array(z.string()).default([]),
  expectedTool: z.string().nullable().default(null),
  expectedToolArgs: z.record(z.any()).nullable().default(null),
  mustRefuse: z.boolean().default(false),
  requiredFields: z.array(z.string()).default([]),
  expectedCategory: z.string().optional()
});

export const EvaluationCaseSchema = z.object({
  id: z.string(),
  input: z.string(),
  category: z.string(),
  expected: EvaluationExpectedSchema,
  context: z.string().optional().default("")
});

export const EvaluationResultSchema = z.object({
  id: z.string(),
  category: z.string(),
  passed: z.boolean(),
  failures: z.array(z.string()),
  checks: z.record(z.boolean()),
  output: z.string(),
  toolCalls: z.array(z.object({
    name: z.string(),
    arguments: z.record(z.any()).default({})
  })),
  latencyMs: z.number(),
  usage: z.object({
    inputTokens: z.number().default(0),
    outputTokens: z.number().default(0),
    totalTokens: z.number().default(0)
  })
});
