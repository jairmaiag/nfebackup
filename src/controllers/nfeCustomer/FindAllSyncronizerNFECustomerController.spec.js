import prismaClient from '../../database/prismaClient'
import FindAllSyncronizerNFECustomerController from './FindAllSyncronizerNFECustomerController'

describe('FindAllSyncronizerNFECustomerController tests', function () {
  test('Should bring customers from database', async () => {
    const result = await FindAllSyncronizerNFECustomerController(prismaClient, 1)
    expect(result).toHaveProperty('body')
  })
});