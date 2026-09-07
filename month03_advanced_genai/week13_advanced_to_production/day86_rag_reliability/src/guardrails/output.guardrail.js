import { z } from "zod";

export const ragResponseSchema =
  z.object({
    answer: z.string().min(1),

    sources: z.array(
      z.object({
        documentId: z.string(),
        title: z.string().optional()
      })
    )
  });

export function validateOutput(
  response
) {
  return ragResponseSchema.parse(
    response
  );
}