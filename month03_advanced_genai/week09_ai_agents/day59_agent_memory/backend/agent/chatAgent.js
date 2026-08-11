import {
  getConversationMessages,
  addUserMessage,
  addAssistantMessage,
} from "../memory/conversationMemory.js";

import { callLLM } from "../services/llmService.js";

import {
  createAgentState,
  incrementStep,
  completeState,
  failState,
} from "./agentState.js";

/**
 * Run one conversational agent turn.
 */
export async function runChat(sessionId, userMessage) {
  const state = createAgentState(sessionId, userMessage);

  try {
    // STEP 1
    incrementStep(state);

    // Save user message.
    addUserMessage(sessionId, userMessage);

    // STEP 2
    incrementStep(state);

    // Load conversation history.
    const messages = getConversationMessages(sessionId);

    state.messages = messages;

    // STEP 3
    incrementStep(state);

    // Send memory + current conversation
    // to the LLM.
    const response = await callLLM(messages);

    // STEP 4
    incrementStep(state);

    // Save assistant response.
    addAssistantMessage(sessionId, response);

    state.messages = getConversationMessages(sessionId);

    // STEP 5
    incrementStep(state);

    completeState(state);

    return {
      response,
      state,
    };
  } catch (error) {
    failState(state, error.message);

    throw error;
  }
}
