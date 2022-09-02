const { PrismaClient } = require("@prisma/client");

module.exports = function DeleteNFECustomerController() {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { id } = request.body;

      try {
        const nfeCustomer = await prismaClient.NFECustomer.delete({
          where: {
            id,
          },
          select: {
            id: true,
          },
        });

        response.status(200).json(nfeCustomer);
      } catch (error) {
        response.status(400).json({
          error: `Delete with ID ${id} does not exist in the database`,
        });
      }
    } catch (error) {
      response.status(500).json({ error: `Error: ${error}` });
    }
  };
};
