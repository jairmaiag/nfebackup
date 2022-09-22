import { AppError } from "../../app/helpers/app-error.js";

class InstitutionRepository {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUnique(id) {
    const institution = await this.prismaClient.institutions.findUnique({
      where: {
        id,
      },
      include: {
        addresses: true,
        mailboxes: true,
      },
    });

    return institution;
  }

  async create(data, mailboxes, addresses) {
    const institution = await this.prismaClient.institutions.create({
      data: {
        ...data,
        mailboxes: {
          create: mailboxes,
        },
        addresses: {
          create: addresses,
        },
      },
    });

    return institution;
  }

  async update(data, mailboxes, addresses) {
    const institution = await this.prismaClient.institutions.update({
      where: {
        id: data.id,
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

    return institution;
  }

  async updateSincronizer(id) {
    const institution = await this.prismaClient.institutions.update({
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

    return institution;
  }

  async findMany() {
    const institutions = await this.prismaClient.institutions.findMany({
      orderBy: {
        id: "asc",
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

    return institutions;
  }
}

export default InstitutionRepository;
