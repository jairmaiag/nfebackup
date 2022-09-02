// const prismaCliente = require("../../../database/prismaClient");

const { PrismaClient } = require("@prisma/client");

module.exports = function CreateNFEBackupController() {
  return async (request, response) => {
    prismaClient = new PrismaClient({
      log: ["error", "info", "query", "warn"],
    });

    const {
      nfeEmailUser,
      nfeEmailPassword,
      nfeEmailHost,
      nfeEmailPort,
      nfeLastDateRead,
    } = request.body;

    const nfeBackup = await prismaClient.NFEBackup.create({
      data: {
        nfeEmailUser,
        nfeEmailPassword,
        nfeEmailHost,
        nfeEmailPort,
        nfeLastDateRead,
      },
    });

    response.status(200).json(nfeBackup);
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
