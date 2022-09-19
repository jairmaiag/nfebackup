const prismaClient = require("./database/prisma-client.js");
const dotenv = require("dotenv");
dotenv.config();

const SyncronizerNFEBackupUseCase = require("./usecases/institution/institution-syncronizer-usecase.js");

module.exports = new SyncronizerNFEBackupUseCase(prismaClient);
