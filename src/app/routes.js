const express = require("express");
const router = express.Router();
const prismaClient = require("../database/prismaClient");

const createNFECustomer = require("../controllers/nfeCustomer/CreateNFECustomerController");
const updateNFECustomer = require("../controllers/nfeCustomer/UpdateNFECustomerController");
const findUniqueNFECustomer = require("../controllers/nfeCustomer/FindUniqueNFECustomerController");
const findUniqueByCNPJEmailPasswordNFECustomer = require("../controllers/nfeCustomer/FindUniqueByCNPJEmailPasswordNFECustomerController");
const deleteNFECustomer = require("../controllers/nfeCustomer/DeleteNFECustomerController");
const createNFEBackup = require("../controllers/nfeBackup/CreateNFEBackupController");

router.post("/nfeCustomer", createNFECustomer(prismaClient));
router.put("/nfeCustomer", updateNFECustomer(prismaClient));
router.get("/nfeCustomer/cnpj/:cnpj", findUniqueNFECustomer(prismaClient));
router.post(
  "/nfeCustotmerValidate",
  findUniqueByCNPJEmailPasswordNFECustomer(prismaClient)
);
router.post("/nfeBackup", createNFEBackup(prismaClient));

/* Executando NFE Backup pelo Windows Task Scheduler */
const nfeBackupSyncronizer = require("../useCases/nfeBackup/NFEBackupSyncronizer");
router.post("/nfeBackupSyncronizer", nfeBackupSyncronizer(prismaClient));

/* Rotas que não serão usadas por enquanto */
// router.get("/nfeCustomer/id/:id", findUniqueNFECustomer(prismaClient));
// router.delete("/nfeCustomer/cnpj/:cnpj", deleteNFECustomer(prismaClient));

module.exports = router;
