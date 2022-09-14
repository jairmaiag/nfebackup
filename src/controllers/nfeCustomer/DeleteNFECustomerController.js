export default function DeleteNFECustomerController(prismaClient) {
  return async (request, response) => {
    try {
      prismaClient = new PrismaClient({
        log: ["error", "info", "query", "warn"],
      });

      const { cnpj } = request.params;

      try {
        const nfeCustomer = await prismaClient.customers.delete({
          where: {
            cnpj,
          },
          select: {
            deletedAt: true,
          },
        });

        response.status(200).json({ status: "success" });
      } catch (error) {
        response.status(400).json({ error: `${error}` });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
