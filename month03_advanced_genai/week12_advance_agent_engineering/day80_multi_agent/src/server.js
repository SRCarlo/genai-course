import app from "./app.js";

import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Multi-agent server running on port ${env.port}`);

  console.log(`Model: ${env.model}`);
});
