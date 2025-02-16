/*
  Warnings:

  - You are about to drop the column `vendorId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `shopName` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `vendors` table. All the data in the column will be lost.
  - Added the required column `shopId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_vendorId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "vendorId",
ADD COLUMN     "shopId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "description",
DROP COLUMN "logo",
DROP COLUMN "shopName",
DROP COLUMN "slug",
ADD COLUMN     "profilePhoto" TEXT;

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
