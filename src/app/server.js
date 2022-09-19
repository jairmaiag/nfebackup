import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { mainRouter } from "./routes.js";
import ErrorHandler from "./middlewares/error-handler.js";

export const app = express();
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
app.use(ErrorHandler);
