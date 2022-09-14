import { PrismaClient } from '@prisma/client'
import { softDeleteMiddleware, softDeleteModels } from "./middlewares/softDelete.js";

const prismaClient = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});

prismaClient.$use((params, next) => softDeleteMiddleware(params, next, softDeleteModels))

export default prismaClient
