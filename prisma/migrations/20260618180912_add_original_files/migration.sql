-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "originalBack" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originalFront" TEXT NOT NULL DEFAULT '';
