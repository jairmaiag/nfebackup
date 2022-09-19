/*
  Warnings:

  - You are about to drop the column `cnpj` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CNPJ]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CNPJ` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_cnpj_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "cnpj",
ADD COLUMN     "CNPJ" VARCHAR(14) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_CNPJ_key" ON "customers"("CNPJ");
