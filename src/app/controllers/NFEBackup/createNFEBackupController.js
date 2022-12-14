// const prismaCliente = require("../../../database/prismaClient");

const { PrismaClient } = require("@prisma/client");

module.exports = function CreateNFEBackupController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { nfeEmailUser } = request.body;
      const data = request.body;
      delete data.id;

      try {
        const nfeBackupResult = await prismaClient.NFEBackup.findUnique({
          where: {
            nfeEmailUser,
          },
        });
        if (nfeBackupResult) {
          response.status(400).json({
            error: `Search with nfeEmailUser ${nfeEmailUser} already exist in the database`,
          });
          return;
        }

        const nfeBackup = await prismaClient.NFEBackup.create({
          data,
        });
        response.status(200).json(nfeBackup);
      } catch (error) {
        response.status(400).json({ error: `${error}` });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
