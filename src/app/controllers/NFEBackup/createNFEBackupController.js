// const prismaCliente = require("../../../database/prismaClient");

const { PrismaClient } = require("@prisma/client");

module.exports = function CreateNFEBackupController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const data = request.body;
      delete data.id;

      const nfeBackup = await prismaClient.NFEBackup.create({
        data,
      });

      response.status(200).json(nfeBackup);
    } catch (error) {
      response.status(500).json({ error: `Error: ${error}` });
    }
  };
};

// module.exports = class CreateNFEBackupController {
//   async handle(request, response) {
//     const {
//       nfeEmailUser,
//       nfeEmailPassword,
//       nfeEmailHost,
//       nfeEmailPort,
//       nfeLastDateRead,
//     } = request.body;

//     const nfeBackup = await prismaCliente.NFEBackup.create({
//       data: {
//         nfeEmailUser,
//         nfeEmailPassword,
//         nfeEmailHost,
//         nfeEmailPort,
//         nfeLastDateRead,
//       },
//     });

//     return response.json(nfeBackup);
//   }
// };
