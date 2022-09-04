const { PrismaClient } = require("@prisma/client");

module.exports = function FindUniqueNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { id, cnpj } = request.params;

      let queryArgs;
      if (id) {
        queryArgs = {
          where: {
            id,
          },
        };
      } else if (cnpj) {
        queryArgs = {
          where: {
            CNPJ: cnpj,
          },
        };
      } else {
        response.status(400).json({
          error: "Use the field 'CNPJ' to search NFECustomer",
        });
        return;
      }

      try {
        const nfeCustomer = await prismaClient.NFECustomer.findUnique(
          queryArgs
        );
        if (!nfeCustomer) {
          const message = id ? `ID ${id}` : ` CNPJ ${cnpj}`;
          response.status(400).json({
            error: `Search with ${message} does not exist in the database`,
          });
          return;
        }

        response.status(200).json(nfeCustomer);
      } catch (error) {
        response.status(400).json({ error: `${error}` });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
