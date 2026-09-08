import { z } from "zod";

export const secureResponseSchema = z.object({
  answer: z.string().min(1).max(10000),
  sources: z.array(
    z.object({
      documentId: z.string(),
      title: z.string().optional()
    })
  )
});

export function validateOutput(output) {
  return secureResponseSchema.parse(output);
}

export function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}
