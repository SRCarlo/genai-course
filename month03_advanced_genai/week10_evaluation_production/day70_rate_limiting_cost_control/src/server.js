import app from "./app.js";
import { env, validateEnv } from "./config/env.js";

validateEnv();

app.listen(env.PORT, () => {
  console.log(`Day 70 API running on http://localhost:${env.PORT}`);
});
