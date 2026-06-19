import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { colors: true, priceTiers: true, sizes: true },
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

const product = await prisma.product.update({
  where: { id: parseInt(id) },
  data: {
    name: body.name,
    price: body.price,
    category: body.category,
    description: body.description,
    image: body.image,
    customizable: body.customizable || false,
    colors: { create: body.colors || [] },
    priceTiers: { create: body.priceTiers || [] },
    sizes: { create: body.sizes?.map((s: string) => ({ name: s })) || [] },
  },
  include: { colors: true, priceTiers: true, sizes: true },
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