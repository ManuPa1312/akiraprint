import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { colors: true, priceTiers: true, sizes: true },
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
      colors: { create: body.colors || [] },
      priceTiers: { create: body.priceTiers || [] },
      sizes: { create: body.sizes?.map((s: string) => ({ name: s })) || [] },
    },
    include: { colors: true, priceTiers: true, sizes: true },
  });
  return NextResponse.json(product);
}