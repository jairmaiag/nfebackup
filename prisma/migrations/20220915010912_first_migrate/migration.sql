-- CreateEnum
CREATE TYPE "states" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SE', 'SP', 'TO', 'DF');

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(250),
    "addressNumber" VARCHAR(250),
    "zipCode" VARCHAR(8),
    "district" VARCHAR(50),
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "state" "states",

    CONSTRAINT "cities_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "corporateName" VARCHAR(250) NOT NULL,
    "fantasyName" VARCHAR(250),
    "cnpj" VARCHAR(15),
    "lastDateRead" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),
    "deletedAt" TIMESTAMP(6),
    "mailboxId" INTEGER NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "customers_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250),
    "mailboxId" INTEGER NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "institutions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions_customers" (
    "id" SERIAL NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "institutions_customers_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailboxes" (
    "id" SERIAL NOT NULL,
    "host" VARCHAR(250) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "port" SMALLINT NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "lastDateRead" INTEGER,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "mailboxes_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cities_fk" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_addresses_fk" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_mailboxes_fk" FOREIGN KEY ("mailboxId") REFERENCES "mailboxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_addresses_fk" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_mailboxes_fk" FOREIGN KEY ("mailboxId") REFERENCES "mailboxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "institutions_customers" ADD CONSTRAINT "institutions_customers_customers_fk" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "institutions_customers" ADD CONSTRAINT "institutions_customers_institutions_fk" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
