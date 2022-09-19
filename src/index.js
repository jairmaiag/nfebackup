import "dotenv/config";

import { app } from "./app/server.js";

// const app = require("./app/server");
const port = process.env.PORT || 80;

app.listen(port, async function () {
  /* Executando NFE Backup pelo Timer */
  // const asService = require("./as-service");
  // await asService.handle();

  console.log(`Server is listening on http://localhost:${port}`);
});
