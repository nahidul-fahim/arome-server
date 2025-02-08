/*
  Warnings:

  - Made the column `productImage` on table `cart_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productName` on table `cart_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "productImage" SET NOT NULL,
ALTER COLUMN "productName" SET NOT NULL;
