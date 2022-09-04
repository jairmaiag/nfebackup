/*
  Warnings:

  - A unique constraint covering the columns `[nfeEmailUser]` on the table `nfe_backup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nfe_backup_nfeEmailUser_key" ON "nfe_backup"("nfeEmailUser");
