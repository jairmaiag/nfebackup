const express = require("express");
const router = express.Router();
const { resultValidate } = require("../utils");
const service = require("../services/main");

router.get("/", function (req, res) {
  res.status(200).json({ mensagem: `Envio padrão` });
});

router.post("/", async function (req, res) {
  const isValid = resultValidate(req.body);
  if (isValid.satusCode === 200) {
    const resposta = await service(req.body);
    req.body.totalDeEmails = resposta.qtdEmail;
    req.body.totalDeNotas = resposta.qtdNfe;
  }
  const mensagem = isValid ? `Resultados do processamento.` : `Estrutura de campos é inválido`;
  res.status(isValid.satusCode).json({
    mensagem,
    data: req.body,
  });
});

module.exports = router;
