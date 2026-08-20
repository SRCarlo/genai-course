import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Day 68 server running on http://localhost:${env.port}`);
});
