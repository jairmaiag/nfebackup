import express from "express";
const router = express.Router();
import prismaClient from "../database/prisma-client.js";

/* Customers routers */
import {
  CreateCustomerController as createCustomer,
  FindUniqueCustomerController as findUniqueCustomer,
  UpdateCustomerController as updateCustomer,
  DeleteCustomerController as deleteCustomer,
  ValidateCNPJEmailPasswordCustomerController as validateCNPJEmailPasswordCustomer,
  CustomerSyncronizerController as customerSyncronizer,
} from "../controllers/customer/index.js";

router.post("/customer", createCustomer(prismaClient));
router.put("/customer", updateCustomer(prismaClient));
router.get("/customer/cnpj/:cnpj", findUniqueCustomer(prismaClient));
router.post(
  "/custotmerValidate",
  validateCNPJEmailPasswordCustomer(prismaClient)
);
/* Executing Customer Syncronization by Windows Task Scheduler */
router.post("/customerSyncronizer", customerSyncronizer(prismaClient));

/* Institutions routers */
import { InstitutionSyncronizerController as institutionsSyncronizer } from "../controllers/institution/index.js";

import { CreateNFEBackupController as createInstitution } from "../controllers/institution/index.js";

router.post("/institution", createInstitution(prismaClient));
/* Executing Institution Syncronization by Windows Task Scheduler */
router.post("/institutionSyncronizer", institutionsSyncronizer(prismaClient));

/* Rotas que não serão usadas por enquanto */
// router.get("/customer/id/:id", findUniqueCustomer(prismaClient));
// router.delete("/customer/cnpj/:cnpj", deleteCustomer(prismaClient));
export const mainRouter = router;
