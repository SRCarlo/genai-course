import { getOrder } from "../tools/getOrder.js";
import { searchKnowledge } from "../tools/searchKnowledge.js";
import { getCustomer } from "../tools/getCustomer.js";
import { updateCustomer } from "../tools/updateCustomer.js";
import { canExecute } from "../security/permissions.js";
import {
  validateToolArguments,
  validateToolName
} from "../security/validation.js";
import { enforceBusinessPolicy } from "../security/policy.js";

const tools = {
  getOrder,
  searchKnowledge,
  getCustomer,
  updateCustomer
};

export async function executeTool({ toolName, args, role, customerId }) {
  validateToolName(toolName);
  validateToolArguments(toolName, args);
  if (!canExecute(toolName, role)) {
    throw new Error(`Tool permission denied: ${toolName}`);
  }

  enforceBusinessPolicy({ toolName, args, role, customerId });

  const tool = tools[toolName];
  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  return tool(args);
}

export function listTools() {
  return Object.keys(tools);
}
