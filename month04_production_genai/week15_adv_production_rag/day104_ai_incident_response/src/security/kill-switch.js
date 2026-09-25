let aiEnabled = true;

export function isAIEnabled() {
  return aiEnabled;
}

export function disableAI() {
  aiEnabled = false;
}

export function enableAI() {
  aiEnabled = true;
}

export function requireAIEnabled() {
  if (!isAIEnabled()) {
    throw new Error("AI functionality temporarily disabled");
  }
}
