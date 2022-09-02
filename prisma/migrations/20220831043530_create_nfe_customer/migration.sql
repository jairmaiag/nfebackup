-- CreateTable
CREATE TABLE "nfe_customers" (
    "id" SERIAL NOT NULL,
    "suuid" TEXT NOT NULL,
    "corporateName" VARCHAR(255) NOT NULL,
    "fantasyName" VARCHAR(255) NOT NULL,
    "CNPJ" VARCHAR(14) NOT NULL,
    "phoneNumber01" VARCHAR(15) NOT NULL,
    "phoneNumber02" VARCHAR(15),
    "street" VARCHAR(255) NOT NULL,
    "addressNumber" VARCHAR(10) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'BRASIL',
    "emailUser" VARCHAR(100) NOT NULL,
    "emailPassword" VARCHAR(25) NOT NULL,
    "emailHost" VARCHAR(100) NOT NULL,
    "emailPort" VARCHAR(5) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfe_customers_pkey" PRIMARY KEY ("id")
);
