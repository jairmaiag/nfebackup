const { imap } = require('./../imapConfig');
module.exports = function(date){
    imap.dados = date;
    imap.once("error", err => console.error);
    imap.once("end", () => console.log("Connection ended"));
    imap.connect();
    return imap;
}