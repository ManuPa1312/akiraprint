import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { colors: true, priceTiers: true, sizes: true, stickerDiscounts: true },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}



export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await prisma.productColor.deleteMany({ where: { productId: parseInt(id) } });
  await prisma.pricetier.deleteMany({ where: { productId: parseInt(id) } });
  await prisma.productSize.deleteMany({ where: { productId: parseInt(id) } });
  await prisma.stickerDiscount.deleteMany({ where: { productId: parseInt(id) } });

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
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
      colors: {
        create: body.colors?.map((c: { name: string; hex: string }) => ({
          name: c.name,
          hex: c.hex,
        })) || [],
      },
      priceTiers: {
        create: body.priceTiers?.map((t: { minQty: number; maxQty: number | null; price: number }) => ({
          minQty: t.minQty,
          maxQty: t.maxQty,
          price: t.price,
        })) || [],
      },
      sizes: {
        create: body.sizes?.map((s: string) => ({ name: s })) || [],
      },
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
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
