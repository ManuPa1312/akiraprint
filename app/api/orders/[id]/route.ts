import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const data: { status?: string; trackingNumber?: string } = {};
  if (body.status) data.status = body.status;
  if (body.trackingNumber) data.trackingNumber = body.trackingNumber;

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data,
  });

  return NextResponse.json(order);
}