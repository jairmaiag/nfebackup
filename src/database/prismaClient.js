const { PrismaClient } = require("@prisma/client");

module.exports = function () {
  const prismaClient = new PrismaClient({
    log: ["error", "info", "query", "warn"],
  });

  return prismaClient;
};

// const prismaClient = new PrismaClient({
//   log: ["error", "info", "query", "warn"],
// });

// module.exports = prismaClient;
