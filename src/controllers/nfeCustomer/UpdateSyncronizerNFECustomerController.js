const { serverError, ok } = require("../../helpers/http/HttpHelpers");

module.exports = async function UpdateSyncronizerNFECustomerController(
  prismaClient,
  id: Number
) {
  try {
    const nfeCustomer = await prismaClient.NFECustomer.update({
      where: {
        id,
      },
      data: {
        nfeLastDateRead: Date.now(),
      },
      select: {
        id: true,
        nfeLastDateRead: true,
      },
    });
    return ok(nfeCustomer);
  } catch (error) {
    console.log(error);
    return serverError(error);
  }
};
