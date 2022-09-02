/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ]` on the table `nfe_customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nfe_customers_CNPJ_key" ON "nfe_customers"("CNPJ");
