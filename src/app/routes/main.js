const express = require("express");
const router = express.Router();

const service = require("../services/main");

router.get("/", function (req, res) {
  res.status(200).json({ mensagem: `Envio padrão` });
});

router.post("/", async function (req, res) {
  const resposta = await service(req.body);
  req.body.totalDeEmails = resposta.qtdEmail;
  req.body.totalDeNotas = resposta.qtdNfe;
  res.status(200).json({
    mensagem: `Resultados do processamento.`,
    data: req.body,
  });
});

module.exports = router;
