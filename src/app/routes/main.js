const express = require("express");
const router = express.Router();

const createNFECustomer = require("../controllers/NFECustomer/createNFECustomerController");
const updateNFECustomer = require("../controllers/NFECustomer/updateNFECustomerController");
const findUniqueNFECustomer = require("../controllers/NFECustomer/findUniqueNFECustomerController");
const deleteNFECustomer = require("../controllers/NFECustomer/deleteNFECustomerController");
const createNFEBackup = require("../controllers/NFEBackup/createNFEBackupController");
const updateNFEBackup = require("../controllers/NFEBackup/updateNFEBackupController");
const { resultValidate } = require("../utils");

const service = require("../services/main");

router.get("/", function (req, res) {
  res.render('main/index');
});
router.get("/customer", function (req, res) {
  res.render('customer/index');
});
router.get("/backup", function (req, res) {
  res.render('backup/index');
});


router.post("/", async function (req, res) {
  const isValid = resultValidate(req.body);
  if (isValid.satusCode === 200) {
    const resposta = await service(req.body);
    req.body.totalDeEmails = resposta.qtdEmail;
    req.body.totalDeNotas = resposta.qtdNfe;
  }
  const mensagem = isValid
    ? `Resultados do processamento.`
    : `Estrutura de campos é inválido`;
  res.status(isValid.satusCode).json({
    mensagem,
    data: req.body,
  });
});

router.post("/nfeCustomer", createNFECustomer());
router.put("/nfeCustomer", updateNFECustomer());
router.get("/nfeCustomer", findUniqueNFECustomer());
router.delete("/nfeCustomer", deleteNFECustomer());
router.post("/nfeBackup", createNFEBackup());
router.put("/nfeBackup", updateNFEBackup());

module.exports = router;
