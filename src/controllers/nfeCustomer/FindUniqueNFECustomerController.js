export default function FindUniqueNFECustomerController(prismaClient) {
  return async (request, response) => {
    try {
      const { id, cnpj } = request.params;

      let queryArgs;
      if (id) {
        queryArgs = {
          where: {
            id,
          },
          select: {
            deletedAt: true,
          },
        };
      } else if (cnpj) {
        queryArgs = {
          where: {
            cnpj,
          },
          select: {
            deletedAt: true,
          },
        };
      } else {
        response.status(400).json({
          error: "Use the field 'CNPJ' to search NFECustomer",
        });
        return;
      }

      try {
        const nfeCustomer = await prismaClient.customers.findUniqueOrThrow(
          queryArgs
        );
        response.status(200).json({ status: "success" });
      } catch (error) {
        response.status(400).json({
          status: `Search with CNPJ ${cnpj} does not exist in the database`,
        });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
