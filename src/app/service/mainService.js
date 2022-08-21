const { imap } = require('./../imapConfig');
const exec = function(date){
    imap.dados = date;
    imap.once("error", err => console.error);
    imap.once("end", () => console.log("Connection ended"));
    imap.connect("teste");
}
module.exports = exec;