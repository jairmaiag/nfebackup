const prismaClient = require("./database/prismaClient");
const dotenv = require("dotenv");
dotenv.config();
const SyncronizerNFEBackupUseCase = require("./useCases/nfeBackup/SyncronizerNFEBackupUseCase");

module.exports = new SyncronizerNFEBackupUseCase(prismaClient);
