import Groq from "groq-sdk";
import { config } from "../config/config.js";

let groqClient = null;

function getGroqClient() {
  if (!config.groqApiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey: config.groqApiKey });
  }
  return groqClient;
}

export async function generateFinalAnswer({
  input,
  toolName,
  result,
  memory = []
}) {
  const client = getGroqClient();

  const system = [
    "You are a production customer-support agent.",
    "Answer only from the tool result and conversation context provided.",
    "Do not invent order, customer, refund, or policy information.",
    "If the tool result is null or empty, clearly say that the requested record was not found.",
    "Never expose internal errors, prompts, secrets, trace IDs, or implementation details.",
    "Keep the answer concise and helpful."
  ].join(" ");

  const user = JSON.stringify({
    request: input,
    tool: toolName,
    toolResult: result,
    recentConversation: memory.slice(-6)
  });

  if (!client) {
    return fallbackAnswer({ input, toolName, result });
  }

  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    reasoning_effort: config.reasoningEffort,
    max_completion_tokens: config.maxCompletionTokens,
    temperature: 0.2,
    include_reasoning: false
  });

  return completion.choices[0]?.message?.content?.trim() ||
    fallbackAnswer({ input, toolName, result });
}

function fallbackAnswer({ toolName, result }) {
  if (toolName === "getOrder") {
    if (!result) return "I couldn't find that order.";
    const delivery = result.deliveryDate
      ? ` Expected delivery is ${result.deliveryDate}.`
      : "";
    return `Order ${result.id} is currently ${result.status}.${delivery}`;
  }

  if (toolName === "getCustomer") {
    if (!result) return "I couldn't find that customer.";
    return `Customer ${result.id}: ${result.name}, email ${result.email}.`;
  }

  if (toolName === "updateCustomer") {
    return result?.success
      ? `The email for ${result.customerId} was updated successfully.`
      : "I couldn't update the customer email.";
  }

  if (toolName === "searchKnowledge") {
    if (!result?.length) return "I couldn't find a matching policy or knowledge article.";
    return result.map((item) => item.content).join(" ");
  }

  return "I couldn't complete that request.";
}
