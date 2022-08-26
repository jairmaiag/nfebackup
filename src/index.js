const dotenv = require("dotenv");
dotenv.config();

const app = require("./app/server");
const port = process.env.PORT || 80;

app.listen(port, function () {
  console.log(`Server is listening on http://localhost:${port}`);
});
