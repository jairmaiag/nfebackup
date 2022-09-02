const express = require("express");
const createNFECustomer = require("../controllers/NFECustomer/createNFECustomerController");
const createNFEBackup = require("../controllers/NFEBackup/createNFEBackupController");
const router = express.Router();

// const { adapt } = require("../adapters/expressRouterAdapter");
// const CreateNFECustomerController = require("../controllers/NFECustomer/createNFECustomerController");
// const createNFECustomer = new CreateNFECustomerController();
// const createNFEBackup = new CreateNFEBackupController();

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

router.post("/nfeCustomer", createNFECustomer());
router.post("/nfeBackup", createNFEBackup());

module.exports = router;
