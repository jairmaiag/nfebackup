/*
  Warnings:

  - You are about to drop the column `cityId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cityName` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_cities_fk";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "cityId",
DROP COLUMN "district",
ADD COLUMN     "cityName" VARCHAR(250) NOT NULL,
ADD COLUMN     "complement" VARCHAR(250),
ADD COLUMN     "country" VARCHAR(100) NOT NULL DEFAULT 'BRASIL',
ADD COLUMN     "neighborhood" VARCHAR(250) NOT NULL,
ADD COLUMN     "state" "states" NOT NULL;

-- DropTable
DROP TABLE "cities";
