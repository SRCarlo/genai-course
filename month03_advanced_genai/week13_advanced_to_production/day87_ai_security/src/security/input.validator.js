import { z } from "zod";

const questionSchema = z.object({
  question: z.string().trim().min(3).max(2000),
  role: z.enum(["user", "admin"]).default("user")
});

export function validateQuestion(input) {
  return questionSchema.parse(input);
}

export function validateToolRequest(input) {
  return z.object({
    toolName: z.string().min(1).max(100),
    arguments: z.record(z.unknown()).default({}),
    role: z.enum(["user", "admin"]).default("user")
  }).parse(input);
}
