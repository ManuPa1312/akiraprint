import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { colors: true, priceTiers: true, sizes: true, stickerDiscounts: true }
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      category: body.category,
      description: body.description,
      image: body.image,
      backImage: body.backImage || "",
      customizable: body.customizable || false,
      backPrice: body.backPrice || 0,
      hasShapeOption: body.hasShapeOption || false,
      isSticker: body.isSticker || false,
      pricePerCm2: body.pricePerCm2 || 0,
      laminationPrice: body.laminationPrice || 0,
      minOrderPrice: body.minOrderPrice || 0,
      minSizeCm: body.minSizeCm || 3,
      maxSizeCm: body.maxSizeCm || 30,
      hasTechniqueOption: body.hasTechniqueOption || false,
      embroideryPrice: body.embroideryPrice || 0,
      featured: body.featured || false,
      colors: { create: body.colors || [] },
      priceTiers: { create: body.priceTiers || [] },
      sizes: { create: body.sizes?.map((s: string) => ({ name: s })) || [] },
      stickerDiscounts: {
        create: body.stickerDiscounts?.map((d: { minQty: number; discount: number }) => ({
          minQty: d.minQty,
          discount: d.discount,
        })) || [],
      },
    },
    include: { colors: true, priceTiers: true, sizes: true, stickerDiscounts: true },
  });
  return NextResponse.json(product);
}