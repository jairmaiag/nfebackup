const { PrismaClient } = require("@prisma/client");

module.exports = function FindUniqueByEmailPasswordNFECustomer() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { nfeEmailUser, nfeEmailPassword } = request.body;

      try {
        const nfeCustomer = await prismaClient.NFECustomer.findFirstOrThrow({
          where: {
            AND: [
              {
                nfeEmailUser,
              },
              {
                nfeEmailPassword,
              },
            ],
          },
          select: {
            inactive: true,
          },
        });

        response.status(200).json({ status: "success" });
      } catch (error) {
        response.status(400).json({ status: "error" });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
