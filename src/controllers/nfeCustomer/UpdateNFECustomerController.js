// import FindUniqueNFECustomerController from './FindUniqueNFECustomerController'

const UpdateNFECustomerController = (prismaClient) => {
  return async (request, response) => {
    try {
      const { CNPJ: cnpj } = request.body;
      const data = request.body;
      delete data.id;

      try {
        const nfeCustomerResult = await prismaClient.customers.findUnique({
          where: {
            cnpj,
          },
        });
        if (!nfeCustomerResult) {
          response.status(400).json({
            error: `Search with CNPJ ${cnpj} does not exist in the database`,
          });
          return;
        }

        const nfeCustomer = await prismaClient.NFECustomer.update({
          where: {
            cnpj,
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

export default UpdateNFECustomerController