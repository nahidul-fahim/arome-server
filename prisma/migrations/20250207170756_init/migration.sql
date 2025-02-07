/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "carts_customerId_key" ON "carts"("customerId");
