/*
  Warnings:

  - You are about to alter the column `addressNumber` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(50)`.
  - You are about to drop the column `lastDateRead` on the `customers` table. All the data in the column will be lost.
  - You are about to alter the column `cnpj` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(14)`.
  - You are about to alter the column `host` on the `mailboxes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(100)`.
  - You are about to alter the column `password` on the `mailboxes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `mailboxes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(100)`.
  - The `lastDateRead` column on the `mailboxes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `street` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `DDD01` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DDI01` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber01` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Made the column `fantasyName` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnpj` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressId` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `institutions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressId` on table `institutions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `mailboxes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "addressNumber" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "zipCode" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "district" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "country" VARCHAR(100) NOT NULL DEFAULT 'BRASIL';

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "lastDateRead",
ADD COLUMN     "DDD01" VARCHAR(5) NOT NULL,
ADD COLUMN     "DDD02" VARCHAR(5),
ADD COLUMN     "DDI01" VARCHAR(5) NOT NULL,
ADD COLUMN     "DDI02" VARCHAR(5),
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "phoneNumber01" VARCHAR(15) NOT NULL,
ADD COLUMN     "phoneNumber02" VARCHAR(15),
ALTER COLUMN "fantasyName" SET NOT NULL,
ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(14),
ALTER COLUMN "addressId" SET NOT NULL;

-- AlterTable
ALTER TABLE "institutions" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "addressId" SET NOT NULL;

-- AlterTable
ALTER TABLE "mailboxes" ALTER COLUMN "host" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "port" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
DROP COLUMN "lastDateRead",
ADD COLUMN     "lastDateRead" TIMESTAMP(6),
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);
