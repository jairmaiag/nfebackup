const { PrismaClient } = require("@prisma/client");

module.exports = function FindUniqueNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { id, CNPJ, cnpj } = request.body;

      let queryArgs;
      if (id) {
        queryArgs = {
          where: {
            id,
          },
        };
      } else if (CNPJ || cnpj) {
        const SearchCNPJ = CNPJ || cnpj;
        queryArgs = {
          where: {
            CNPJ: SearchCNPJ,
          },
        };
      } else {
        return response.status(400).json({
          error: `Use the fields 'id' or 'CNPJ' on body to search NFECustomer`,
        });
      }

      try {
        const nfeCustomer = await prismaClient.NFECustomer.findUniqueOrThrow(
          queryArgs
        );

        response.status(200).json(nfeCustomer);
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
