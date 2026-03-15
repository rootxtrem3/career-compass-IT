import app from "./app.js";
import { config } from "./utils/config.js";

app.listen(config.PORT, () => {
  console.log(`Career Compass backend listening on ${config.PORT}`);
});
