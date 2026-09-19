import { app } from "./app.js";
import { config } from "./config/config.js";

app.listen(config.PORT, () => {
  console.log(`Day 98 API running on http://localhost:${config.PORT}`);
});
