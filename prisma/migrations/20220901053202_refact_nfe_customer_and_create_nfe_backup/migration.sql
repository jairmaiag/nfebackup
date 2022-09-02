/*
  Warnings:

  - You are about to drop the column `emailHost` on the `nfe_customers` table. All the data in the column will be lost.
  - You are about to drop the column `emailPassword` on the `nfe_customers` table. All the data in the column will be lost.
  - You are about to drop the column `emailPort` on the `nfe_customers` table. All the data in the column will be lost.
  - You are about to drop the column `emailUser` on the `nfe_customers` table. All the data in the column will be lost.
  - Added the required column `DDD01` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DDI01` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nfeEmailHost` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nfeEmailPassword` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nfeEmailPort` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nfeEmailUser` to the `nfe_customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfe_customers" DROP COLUMN "emailHost",
DROP COLUMN "emailPassword",
DROP COLUMN "emailPort",
DROP COLUMN "emailUser",
ADD COLUMN     "DDD01" VARCHAR(5) NOT NULL,
ADD COLUMN     "DDD02" VARCHAR(5),
ADD COLUMN     "DDI01" VARCHAR(5) NOT NULL,
ADD COLUMN     "DDI02" VARCHAR(5),
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "nfeEmailHost" VARCHAR(100) NOT NULL,
ADD COLUMN     "nfeEmailPassword" VARCHAR(25) NOT NULL,
ADD COLUMN     "nfeEmailPort" VARCHAR(5) NOT NULL,
ADD COLUMN     "nfeEmailUser" VARCHAR(100) NOT NULL,
ADD COLUMN     "nfeLastDateRead" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "nfe_backup" (
    "id" SERIAL NOT NULL,
    "nfeEmailUser" VARCHAR(100) NOT NULL,
    "nfeEmailPassword" VARCHAR(25) NOT NULL,
    "nfeEmailHost" VARCHAR(100) NOT NULL,
    "nfeEmailPort" VARCHAR(5) NOT NULL,
    "nfeLastDateRead" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfe_backup_pkey" PRIMARY KEY ("id")
);
