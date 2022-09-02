const { PrismaClient } = require("@prisma/client");

module.exports = function UpdateNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { id } = request.body;
      const data = request.body;

      try {
        const nfeCustomer = await prismaClient.NFECustomer.update({
          where: {
            id,
          },
          data,
        });

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
