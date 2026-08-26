export function assignVariant(userId = "") {
  let hash = 0;

  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % 100;
  }

  return hash < 50 ? "A" : "B";
}

export function getPromptVariant(userId) {
  const variant = assignVariant(userId);

  return {
    variant,
    promptVersion: variant === "A" ? "v2" : "v3",
  };
}
