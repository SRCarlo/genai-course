import { saveMessage, getMessages } from "./shortTermMemory.js";

import {
  saveLongTermMemory,
  getLongTermMemory,
  getAllLongTermMemory,
  deleteLongTermMemory,
} from "./longTermMemory.js";

export function remember(message) {
  saveMessage(message);
}

export function recall() {
  return getMessages();
}

export async function rememberFact(key, value) {
  await saveLongTermMemory(key, value);
}

export async function recallFact(key) {
  return await getLongTermMemory(key);
}

export async function recallAll() {
  return await getAllLongTermMemory();
}

export async function forgetFact(key) {
  await deleteLongTermMemory(key);
}
