const express = require("express");
const router = express.Router();

const service = require("../services/main");

router.get("/", function (req, res) {
  res.status(200).json({ mensagem: `Envio padrão` });
});

router.post("/", function (req, res) {
  service(req.body);

  res.status(200).json({
    data: req.body,
    mensagem: `Envio padrão`,
  });
});

module.exports = router;
