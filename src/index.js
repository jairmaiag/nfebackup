require('dotenv/config');
const { imap } = require('./app/imapConfig');

/* Captura da passgem de parâmetros via linha de comando */
const param = process.argv;
if(param.length > 2){
  const modo = param[2];
  if(modo === 'production'){
    process.env.NODE_ENV = 'production';
  }
}

imap.once("error", err => console.error);
imap.once("end", () => console.log("Connection ended"));
imap.connect();