import httpHelper from "../../app/helpers/http/HttpHelpers.js"

export default async function FindAllSyncronizerNFECustomerController(
  prismaClient,
  id,
) {
  try {
    const nfeCustomer = await prismaClient.customers.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        corporateName: true,
        lastDateRead: true,
        deletedAt: true,
        mailboxes: {
          select: {
            email: true,
            password: true,
            host: true,
            port: true
          }
        }
      },
    });
    return nfeCustomer ? httpHelper.ok(nfeCustomer) : httpHelper.notFound("Registro não encontrado");
  } catch (error) {
    console.log(error);
    return httpHelper.serverError(error);
  }
};
