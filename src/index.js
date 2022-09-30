import "dotenv/config";
import { app } from "./app/server.js";

const port = process.env.PORT || 80;

app.listen(port, async function () {
  /* Executando NFE Backup pelo Timer */
  // import { AsService } from "./usecases/syncronizer/index.js";
  // const asService = new AsService();
  // await asService.handle();
  console.log(`Server is listening on http://localhost:${port}`);
});
