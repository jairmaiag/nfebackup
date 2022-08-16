const Imap = require("imap");
const imap = new Imap({
	user:  process.env.EMAIL,
	password: process.env.SENHA_EMAIL,
	host: process.env.HOST_EMAIL,
	port: process.env.PORT_EMAIL,
	tls: true,
	debug: function (msg) {
		console.log("Debug do imap:", msg);
	},
});
module.exports = imap;
