const { serverError, ok, notFound } = require("../../helpers/http/HttpHelpers");

module.exports = async function FindAllSyncronizerNFECustomerController(
  prismaClient
) {
  try {
    const nfeCustomer = await prismaClient.NFECustomer.findMany({
      orderBy: {
        id,
      },
      select: {
        id: true,
        nfeLastDateRead: true,
        nfeEmailUser: true,
        nfeEmailPassword: true,
        nfeEmailHost: true,
        nfeEmailPort: true,
        nfeLastDateRead: true,
        inactive: true,
      },
    });
    return nfeCustomer ? ok(nfeCustomer) : notFound("Registro não encontrado");
  } catch (error) {
    console.log(error);
    return serverError(error);
  }
};
