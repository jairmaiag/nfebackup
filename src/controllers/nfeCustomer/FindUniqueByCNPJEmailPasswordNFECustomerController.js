module.exports = function FindUniqueByCNPJEmailPasswordNFECustomer(
  prismaClient
) {
  return async (request, response) => {
    try {
      const { CNPJ, nfeEmailUser, nfeEmailPassword } = request.body;

      try {
        const nfeCustomer = await prismaClient.NFECustomer.findFirst({
          where: {
            AND: [
              {
                CNPJ,
              },
              {
                nfeEmailUser,
              },
              {
                nfeEmailPassword,
              },
            ],
          },
        });

        if (!nfeCustomer) {
          response.status(400).json({
            error: `Invalid CNPJ: '${CNPJ}', e-mail: '${nfeEmailUser}' or passwoard`,
          });
          return;
        }

        response.status(200).json(nfeCustomer);
      } catch (error) {
        response.status(400).json({ status: `${error}` });
      }
    } catch (error) {
      response.status(500).json({ error: `${error}` });
    }
  };
};
