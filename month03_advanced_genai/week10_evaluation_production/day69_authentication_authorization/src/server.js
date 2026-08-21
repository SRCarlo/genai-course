import "./config/env.js";

import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Day 69 API running on http://localhost:${env.port}`);
});
