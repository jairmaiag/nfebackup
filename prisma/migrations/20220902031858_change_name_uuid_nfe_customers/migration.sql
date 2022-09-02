/*
  Warnings:

  - You are about to drop the column `suuid` on the `nfe_customers` table. All the data in the column will be lost.
  - The required column `uuid` was added to the `nfe_customers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "nfe_customers" DROP COLUMN "suuid",
ADD COLUMN     "uuid" TEXT NOT NULL;
