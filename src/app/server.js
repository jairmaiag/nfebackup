const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");

const mainRouter = require("./routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("src/app/public"));
app.set("view engine", "ejs");
app.set("views", "src/app/views");

const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
};

app.use(session(sessionConfig));
app.use(cors());
app.use(mainRouter);

module.exports = app;
