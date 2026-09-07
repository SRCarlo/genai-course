import { z } from "zod";

const querySchema = z.object({
  question: z
    .string()
    .trim()
    .min(
      3,
      "Question must contain at least 3 characters."
    )
    .max(
      2000,
      "Question cannot exceed 2000 characters."
    )
});

export function validateQuery(input) {
  return querySchema.parse(input);
}