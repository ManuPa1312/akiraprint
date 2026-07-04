import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine");

  if (mine === "true" && session?.user?.email) {
    const orders = await prisma.order.findMany({
      where: { customerEmail: session.user.email },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json(orders);
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return NextResponse.json(orders);
}