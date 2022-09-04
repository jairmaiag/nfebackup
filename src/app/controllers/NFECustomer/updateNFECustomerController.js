const { PrismaClient } = require("@prisma/client");
const findUniqueNFECustomer = require("./findUniqueNFECustomerController");

module.exports = function UpdateNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { CNPJ } = request.body;
      const data = request.body;
      delete data.id;

      try {
        const nfeCustomerResult = await prismaClient.NFECustomer.findUnique({
          where: {
            CNPJ,
          },
        });
        if (!nfeCustomerResult) {
          response.status(400).json({
            error: `Search with CNPJ ${CNPJ} does not exist in the database`,
          });
          return;
        }

        const nfeCustomer = await prismaClient.NFECustomer.update({
          where: {
            CNPJ,
          },
          data,
        });
        response.status(200).json(nfeCustomer);
      } catch (error) {
        response.status(400).json({ error: `${error}` });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
