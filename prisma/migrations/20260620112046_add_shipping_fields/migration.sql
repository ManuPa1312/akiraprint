-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "customerName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "customerPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingCountry" TEXT NOT NULL DEFAULT 'Italia',
ADD COLUMN     "shippingZip" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "trackingNumber" TEXT NOT NULL DEFAULT '';
