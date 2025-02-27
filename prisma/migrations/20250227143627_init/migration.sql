-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP DEFAULT;
