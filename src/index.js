const configApp = require('./configApp');
configApp.configurar();
const { imap } = require('./app/imapConfig');
imap.once("error", err => console.error);
imap.once("end", () => console.log("Connection ended"));
imap.connect();