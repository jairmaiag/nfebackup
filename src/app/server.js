const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mainRouter = require('./route/mainRoute');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Configuração da sessão */
const configSession = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  };
  
app.use(session(configSession));
app.use(cors());
app.use(mainRouter);

module.exports = app;  