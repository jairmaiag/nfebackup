/*
  Warnings:

  - Added the required column `zipCode` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfe_customers" ADD COLUMN     "inactive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "zipCode" VARCHAR(8) NOT NULL;
