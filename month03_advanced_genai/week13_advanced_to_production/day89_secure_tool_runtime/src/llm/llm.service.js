import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing. Check your .env file.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL =
  process.env.GROQ_MODEL ||
  "openai/gpt-oss-20b";

/*
|--------------------------------------------------------------------------
| Available Tools
|--------------------------------------------------------------------------
| These are the ONLY tools the LLM is allowed to request.
|
| Important:
| The LLM does NOT execute these tools.
| It only returns a structured request.
|
| The secure runtime performs:
|
| LLM
|  ↓
| Tool Request
|  ↓
| Registry
|  ↓
| Validation
|  ↓
| Authorization
|  ↓
| Risk Policy
|  ↓
| Approval
|  ↓
| Execution
|--------------------------------------------------------------------------
*/

const tools = [
  {
    type: "function",
    function: {
      name: "getOrder",
      description: "Retrieve order information using an order ID.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The order ID to retrieve."
          }
        },
        required: ["orderId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "searchOrders",
      description:
        "Search orders using a customer ID or order status.",
      parameters: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
            description: "Customer ID."
          },
          status: {
            type: "string",
            enum: [
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "refunded"
            ],
            description: "Order status."
          }
        },
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "refundOrder",
      description: "Refund an order.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The order ID to refund."
          },
          reason: {
            type: "string",
            description: "Reason for the refund."
          }
        },
        required: ["orderId", "reason"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "deleteCustomer",
      description: "Delete a customer account.",
      parameters: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
            description: "The customer ID to delete."
          }
        },
        required: ["customerId"],
        additionalProperties: false
      }
    }
  }
];

/*
|--------------------------------------------------------------------------
| Safe JSON Parser
|--------------------------------------------------------------------------
*/

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Normalize Tool Names
|--------------------------------------------------------------------------
|
| This protects the runtime from small naming variations produced by
| the model.
|
| Canonical names MUST still be used internally.
|--------------------------------------------------------------------------
*/

function normalizeToolName(toolName) {
  const aliases = {
    get_order_status: "getOrder",
    get_order: "getOrder",

    search_orders: "searchOrders",

    refund_order: "refundOrder",

    delete_customer: "deleteCustomer"
  };

  return aliases[toolName] || toolName;
}

/*
|--------------------------------------------------------------------------
| Normalize Tool Arguments
|--------------------------------------------------------------------------
|
| Converts common snake_case arguments into the canonical runtime format.
|--------------------------------------------------------------------------
*/

function normalizeToolArguments(toolName, args = {}) {
  const normalized = { ...args };

  if (toolName === "getOrder") {
    if (!normalized.orderId && normalized.order_id) {
      normalized.orderId = normalized.order_id;
    }

    delete normalized.order_id;
  }

  if (toolName === "searchOrders") {
    if (!normalized.customerId && normalized.customer_id) {
      normalized.customerId = normalized.customer_id;
    }

    delete normalized.customer_id;
  }

  if (toolName === "refundOrder") {
    if (!normalized.orderId && normalized.order_id) {
      normalized.orderId = normalized.order_id;
    }

    delete normalized.order_id;
  }

  if (toolName === "deleteCustomer") {
    if (!normalized.customerId && normalized.customer_id) {
      normalized.customerId = normalized.customer_id;
    }

    delete normalized.customer_id;
  }

  return normalized;
}

/*
|--------------------------------------------------------------------------
| Call Groq
|--------------------------------------------------------------------------
*/

export async function callLLM(messages) {
  const response = await groq.chat.completions.create({
    model: MODEL,

    temperature: 0,

    messages: [
      {
        role: "system",
        content: `
You are a secure AI agent.

You NEVER execute tools yourself.

You may request a tool only when necessary.

Use ONLY the available tools provided by the application.

Use the exact canonical tool names:

- getOrder
- searchOrders
- refundOrder
- deleteCustomer

Use the exact argument names defined by each tool.

Never invent tools.

Never execute JavaScript.

Never execute shell commands.

Never expose secrets.

For destructive or financial operations, request the appropriate tool.
The application will independently enforce authorization, validation,
risk policy and human approval.
`
      },

      ...messages
    ],

    tools,

    /*
     * Let the model decide whether it needs a tool.
     */
    tool_choice: "auto"
  });

  const message = response.choices?.[0]?.message;

  if (!message) {
    return {
      type: "final",
      text: "No response generated."
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Native Groq Tool Call
  |--------------------------------------------------------------------------
  */

  if (
    Array.isArray(message.tool_calls) &&
    message.tool_calls.length > 0
  ) {
    const toolCall = message.tool_calls[0];

    const rawToolName =
      toolCall.function?.name;

    const toolName =
      normalizeToolName(rawToolName);

    const rawArguments =
      toolCall.function?.arguments || "{}";

    const parsedArguments =
      safeJsonParse(rawArguments) || {};

    const normalizedArguments =
      normalizeToolArguments(
        toolName,
        parsedArguments
      );

    return {
      toolCall: {
        id: toolCall.id,
        tool: toolName,
        arguments: normalizedArguments
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Normal Final Response
  |--------------------------------------------------------------------------
  */

  return {
    type: "final",
    text: message.content || ""
  };
}