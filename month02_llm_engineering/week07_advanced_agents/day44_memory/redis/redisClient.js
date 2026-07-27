import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("Redis Connected");
});

client.on("error", (error) => {
  console.log("Redis Error:", error);
});

await client.connect();

export default client;
