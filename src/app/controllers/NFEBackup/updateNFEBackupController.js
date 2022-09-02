const { PrismaClient } = require("@prisma/client");

module.exports = function UpdateNFEBackupController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { id, nfeLastDateRead } = request.body;
      try {
        const nfeBackup = await prismaClient.NFEBackup.update({
          where: {
            id,
          },
          data: {
            nfeLastDateRead,
          },
          select: {
            id: true,
            nfeLastDateRead: true,
          },
        });

        response.status(200).json(nfeBackup);
      } catch (error) {
        response
          .status(400)
          .json({ error: `Put with ID ${id} does not exist in the database` });
      }
    } catch (error) {
      response.status(500).json({ error: `Error: ${error}` });
    }
  };
};
