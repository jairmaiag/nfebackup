/*
  Warnings:

  - You are about to drop the `institutions_customers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institutionId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "institutions_customers" DROP CONSTRAINT "institutions_customers_customers_fk";

-- DropForeignKey
ALTER TABLE "institutions_customers" DROP CONSTRAINT "institutions_customers_institutions_fk";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "institutionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "institutions_customers";

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_institutions_fk" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
