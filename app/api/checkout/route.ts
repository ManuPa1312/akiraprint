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
  shipping_address_collection: {
    allowed_countries: ["IT", "SM", "VA"],
  },
  phone_number_collection: {
    enabled: true,
  },
  shipping_options: [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 500, currency: "eur" },
        display_name: "Spedizione standard (3-5 giorni)",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 3 },
          maximum: { unit: "business_day", value: 5 },
        },
      },
    },
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 1000, currency: "eur" },
        display_name: "Spedizione express (1-2 giorni)",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 1 },
          maximum: { unit: "business_day", value: 2 },
        },
      },
    },
  ],
  metadata: {
    pendingOrderId: pending.id.toString(),
  },
});

  return NextResponse.json({ url: session.url });
}