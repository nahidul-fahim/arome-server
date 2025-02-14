/*
  Warnings:

  - You are about to drop the column `shippingDetailsId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `shipping_details` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `shipping_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `shipping_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `shipping_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_details" DROP CONSTRAINT "shipping_details_districtId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_details" DROP CONSTRAINT "shipping_details_regionId_fkey";

-- DropIndex
DROP INDEX "orders_shippingDetailsId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "shippingDetailsId";

-- AlterTable
ALTER TABLE "shipping_details" DROP COLUMN "districtId",
DROP COLUMN "regionId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "shipping_details_orderId_key" ON "shipping_details"("orderId");

-- AddForeignKey
ALTER TABLE "shipping_details" ADD CONSTRAINT "shipping_details_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
