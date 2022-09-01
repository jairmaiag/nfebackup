const dotenv = require("dotenv");
dotenv.config();
const { defaultEmail } = require("./app/utils");
const service = require("./app/services/main");

setInterval(() => service(defaultEmail), 3.6e+6);