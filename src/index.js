const configApp = require('./configApp');
configApp.configurar();
const app = require('./app/server');

/* parametrizar a porta de escuta */
const port = process.env.PORT || 80;
app.listen(port, function () {
  const acesso = `http://localhost${port === 80 ? "" : ":" + port}`;
  console.log(acesso);
});
