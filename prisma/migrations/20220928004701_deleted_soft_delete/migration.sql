/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `mailboxes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "deletedAt",
ADD COLUMN     "inactive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "mailboxes" DROP COLUMN "deletedAt",
ADD COLUMN     "inactive" BOOLEAN NOT NULL DEFAULT false;
