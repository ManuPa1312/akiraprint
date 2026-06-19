import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { items } = await req.json();

  // Salva i dati dell'ordine nel DB prima di Stripe
  const pending = await prisma.pendingOrder.create({
    data: {
      data: JSON.stringify(items),
    },
  });

  const lineItems = items.map((item: {
    name: string;
    price: number;
    quantity: number;
  }) => ({
    price_data: {
      currency: "eur",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: {
      pendingOrderId: pending.id.toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}