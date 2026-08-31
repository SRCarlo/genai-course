import { estimateContextTokens } from "./tokenizer.js";

export async function buildManagedContext({
  systemPrompt,
  memories = [],
  messages = [],
  summary = null,
  maxMessages = 20,
  maxTokens = 12000,
}) {
  let selectedMessages = messages.slice(-maxMessages);

  let context = {
    systemPrompt,
    summary,
    memories,
    messages: selectedMessages,
  };

  let estimated = estimateContextTokens({
    systemPrompt,
    memories,
    messages: selectedMessages,
  });

  while (estimated > maxTokens && selectedMessages.length > 2) {
    selectedMessages = selectedMessages.slice(1);

    estimated = estimateContextTokens({
      systemPrompt,
      memories,
      messages: selectedMessages,
    });
  }

  context.messages = selectedMessages;

  context.estimatedTokens = estimated;

  return context;
}
