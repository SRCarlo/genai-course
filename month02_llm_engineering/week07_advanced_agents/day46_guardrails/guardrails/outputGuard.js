const blockedContent = [
  "api_key",
  "secret",
  "password",
  "private key",
  "access token",
  "bearer",
  "authorization:",
  "database password",
  "aws_secret",
  "openai_api_key",
  "groq_api_key",
];

export function validateOutput(output) {
  if (!output || typeof output !== "string") {
    return false;
  }

  const text = output.toLowerCase();

  return !blockedContent.some((item) => text.includes(item));
}
