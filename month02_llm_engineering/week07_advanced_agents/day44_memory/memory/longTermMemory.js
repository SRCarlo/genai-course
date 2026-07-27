import client from "../redis/redisClient.js";

export async function saveLongTermMemory(key, value) {
  await client.set(key, value);
}

export async function getLongTermMemory(key) {
  const value = await client.get(key);

  return value;
}

export async function getAllLongTermMemory() {
  const keys = await client.keys("*");

  const memories = {};

  for (const key of keys) {
    memories[key] = await client.get(key);
  }

  return memories;
}

export async function deleteLongTermMemory(key) {
  await client.del(key);
}
