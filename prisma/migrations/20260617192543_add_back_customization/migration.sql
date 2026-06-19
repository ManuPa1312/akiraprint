-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "customizationBack" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "customizationFront" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "backImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "backPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
