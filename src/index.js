const dotenv = require("dotenv");
dotenv.config();

const app = require("./app/server");
const port = process.env.PORT || 80;

app.listen(port, async function () {
  /* Executando NFE Backup pelo Timer */
  // const asService = require("./asService");
  // await asService.handle();

  console.log(`Server is listening on http://localhost:${port}`);
});
