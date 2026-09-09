import { groq, GROQ_MODEL } from "./groq.client.js";

const SYSTEM_PROMPT = `
You are the planning layer of a secure AI agent system.

You may suggest a tool call, but you never authorize or execute it.
The application security gateway is the final authority.

Available tools:
- searchOrders(customerId)
- getCustomer(customerId)
- refundOrder(orderId, reason)
- deleteCustomer(customerId, reason)

Return JSON only:
{
  "tool": string | null,
  "arguments": object,
  "explanation": string
}
`;

export async function planToolCall(userMessage) {
  if (!groq) {
    throw new Error("GROQ_API_KEY_NOT_CONFIGURED");
  }

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    reasoning_effort: "low",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ]
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("EMPTY_GROQ_RESPONSE");

  return JSON.parse(content);
}
