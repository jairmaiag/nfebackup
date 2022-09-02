const { PrismaClient } = require("@prisma/client");

module.exports = function CreateNFECustomerController() {
  return async (request, response) => {
    prismaClient = new PrismaClient({
      log: ["error", "info", "query", "warn"],
    });

    const {
      corporateName,
      fantasyName,
      CNPJ,
      DDI01,
      DDD01,
      phoneNumber01,
      DDI02,
      DDD02,
      phoneNumber02,
      email,
      street,
      addressNumber,
      district,
      city,
      state,
      country,
      nfeEmailUser,
      nfeEmailPassword,
      nfeEmailHost,
      nfeEmailPort,
      nfeLastDateRead,
    } = request.body;

    const nfeCustomer = await prismaClient.NFECustomer.create({
      data: {
        corporateName,
        fantasyName,
        CNPJ,
        DDI01,
        DDD01,
        phoneNumber01,
        DDI02,
        DDD02,
        phoneNumber02,
        email,
        street,
        addressNumber,
        district,
        city,
        state,
        country,
        nfeEmailUser,
        nfeEmailPassword,
        nfeEmailHost,
        nfeEmailPort,
        nfeLastDateRead,
      },
    });

    response.status(200).json(nfeCustomer);
  };
};
