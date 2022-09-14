export default function CreateNFEBackupController(prismaClient) {
  return async (request, response) => {
    try {
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
        //TODO: usar httpHelper
        response.status(200).json(nfeBackup);
      } catch (error) {
        //TODO: usar httpHelper
        response.status(400).json({ error: `${error}` });
      }
    } catch (error) {
      //TODO: usar httpHelper
      response.status(500).json({ error: `${error}` });
    }
  };
};
