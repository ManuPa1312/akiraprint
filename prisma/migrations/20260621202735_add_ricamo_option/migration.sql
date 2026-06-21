-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "embroideryPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "hasTechniqueOption" BOOLEAN NOT NULL DEFAULT false;
