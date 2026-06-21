-- CreateTable
CREATE TABLE "StickerDiscount" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "minQty" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StickerDiscount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StickerDiscount" ADD CONSTRAINT "StickerDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
