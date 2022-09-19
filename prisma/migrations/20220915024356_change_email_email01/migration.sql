/*
  Warnings:

  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - Added the required column `email01` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "email",
ADD COLUMN     "email01" VARCHAR(100) NOT NULL;
