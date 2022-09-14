import httpHelper from '../../app/helpers/http/HttpHelpers.js'

const UpdateSyncronizerNFECustomerController = async (
  prismaClient,
  id
) => {
  try {
    const customer = await prismaClient.customers.update({
      where: {
        id,
      },
      data: {
        lastDateRead: Date.now(),
      },
      select: {
        id: true,
        lastDateRead: true,
      },
    });
    return httpHelper.ok(customer);
  } catch (error) {
    console.log(error);
    return httpHelper.serverError(error);
  }
};

export default UpdateSyncronizerNFECustomerController