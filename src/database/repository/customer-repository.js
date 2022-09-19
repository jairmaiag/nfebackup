import { AppError } from "../../app/helpers/app-error.js";

class CustomerRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUnique(CNPJ, id) {
    let queryArgs;
    if (id) {
      queryArgs = {
        where: {
          id,
        },
      };
    } else if (CNPJ) {
      queryArgs = {
        where: {
          CNPJ,
        },
        include: {
          mailboxes: true,
          addresses: true,
        },
      };
    } else {
      throw new AppError("Use the field 'CNPJ' to search NFECustomer", 400);
    }

    const customer = await this.prismaClient.customers.findUnique(queryArgs);

    return customer;
  }

  async create(data, mailboxes, addresses) {
    const customer = await this.prismaClient.customers.create({
      data: {
        ...data,
        mailboxes: {
          create: mailboxes,
        },
        addresses: {
          create: addresses,
        },
        institutions_customers: {
          create: {
            institutionId: 2,
          },
        },
      },
    });

    return customer;
  }

  async update(data, mailboxes, addresses) {
    const customer = await this.prismaClient.customers.update({
      where: {
        CNPJ: data.CNPJ,
      },
      data: {
        ...data,
        mailboxes: {
          update: mailboxes,
        },
        addresses: {
          update: addresses,
        },
      },
    });

    return customer;
  }

  async delete(CNPJ) {
    const customer = await this.prismaClient.customers.delete({
      where: {
        CNPJ,
      },
    });

    return customer;
  }

  async updateSincronizer(id) {
    const customers = await this.prismaClient.customers.update({
      where: {
        id,
      },
      data: {
        mailboxes: {
          update: {
            data: {
              lastDateRead: new Date(),
            },
          },
        },
      },
    });

    return customers;
  }

  async findMany() {
    const customers = await this.prismaClient.customers.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        NOT: [{ deletedAt: null }],
      },
      select: {
        id: true,
        mailboxes: {
          select: {
            email: true,
            password: true,
            host: true,
            port: true,
          },
        },
      },
    });

    return customers;
  }
}

export default CustomerRepository;
