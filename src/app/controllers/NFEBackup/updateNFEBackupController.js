const { PrismaClient } = require("@prisma/client");

module.exports = function UpdateNFEBackupController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { nfeEmailUser, nfeLastDateRead } = request.body;
      try {
        const nfeBackupResult = await prismaClient.NFEBackup.findUnique({
          where: {
            nfeEmailUser,
          },
        });
        if (!nfeBackupResult) {
          response.status(400).json({
            error: `NFEBackup with nfeEmailUser ${nfeEmailUser} does not exist in the database`,
          });
          return;
        }

        const nfeBackup = await prismaClient.NFEBackup.update({
          where: {
            nfeEmailUser,
          },
          data: {
            nfeLastDateRead,
          },
          select: {
            nfeEmailUser: true,
            nfeLastDateRead: true,
          },
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
