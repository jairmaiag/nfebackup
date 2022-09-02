const { PrismaClient } = require("@prisma/client");

module.exports = function CreateNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const data = request.body;
      delete data.id;

      const nfeCustomer = await prismaClient.NFECustomer.create({
        data,
      });

      response.status(200).json(nfeCustomer);
    } catch (error) {
      response.status(500).json({ error: `Error: ${error}` });
    }
  };
};
