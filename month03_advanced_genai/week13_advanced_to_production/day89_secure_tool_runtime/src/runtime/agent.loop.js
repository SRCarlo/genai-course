export async function runAgent({
  llm,
  messages,
  executeTool,
  maxToolCalls = 10
}) {
  let toolCalls = 0;

  while (toolCalls < maxToolCalls) {
    const response = await llm(messages);

    /*
    |--------------------------------------------------------------------------
    | Final Answer
    |--------------------------------------------------------------------------
    */

    if (!response.toolCall) {
      return response.text;
    }

    toolCalls++;

    /*
    |--------------------------------------------------------------------------
    | Execute Tool Through Security Gateway
    |--------------------------------------------------------------------------
    */

    const result = await executeTool(response.toolCall);

    /*
    |--------------------------------------------------------------------------
    | Human Approval Required
    |--------------------------------------------------------------------------
    |
    | Stop the agent loop.
    |
    | This is a security state, not an application crash.
    |--------------------------------------------------------------------------
    */

    if (result.requiresApproval) {
      return {
        type: "approval_required",
        tool: response.toolCall.tool,
        arguments: response.toolCall.arguments,
        message:
          "Human approval is required before this action can be executed."
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Tool Execution Failed
    |--------------------------------------------------------------------------
    */

    if (!result.success) {
      return {
        type: "tool_error",
        tool: response.toolCall.tool,
        error: result.error
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Send Tool Result Back To LLM
    |--------------------------------------------------------------------------
    */

    const toolCallId =
      response.toolCall.id ||
      `tool_call_${toolCalls}`;

    messages.push({
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: toolCallId,
          type: "function",
          function: {
            name: response.toolCall.tool,
            arguments: JSON.stringify(
              response.toolCall.arguments
            )
          }
        }
      ]
    });

    messages.push({
      role: "tool",
      tool_call_id: toolCallId,
      content: JSON.stringify(result)
    });
  }

  throw new Error("AGENT_MAX_TOOL_CALLS");
}