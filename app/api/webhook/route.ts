import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
  const sessionData = event.data.object as Stripe.Checkout.Session;
  try {
    // Recupera la sessione completa con i dettagli espansi
    const session = await stripe.checkout.sessions.retrieve(sessionData.id, {
      expand: ["customer_details"],
    });

    const pendingOrderId = parseInt(session.metadata?.pendingOrderId || "0");
    const pending = await prisma.pendingOrder.findUnique({
      where: { id: pendingOrderId },
    });

    if (!pending) throw new Error("Pending order non trovato");

    const items = JSON.parse(pending.data);

    const customerDetails = session.customer_details;
    const shippingCost = session.shipping_cost?.amount_total || 0;

    await prisma.order.create({
      data: {
        total: (session.amount_total || 0) / 100,
        status: "pagato",
        customerName: customerDetails?.name || "",
        customerEmail: customerDetails?.email || "",
        customerPhone: customerDetails?.phone || "",
        shippingAddress: customerDetails?.address
          ? `${customerDetails.address.line1 || ""} ${customerDetails.address.line2 || ""}`.trim()
          : "",
        shippingCity: customerDetails?.address?.city || "",
        shippingZip: customerDetails?.address?.postal_code || "",
        shippingCountry: customerDetails?.address?.country || "IT",
        shippingCost: shippingCost / 100,
        items: {
          create: items.map((item: {
            id: number;
            quantity: number;
            price: number;
            customizationFront?: string;
            customizationBack?: string;
            originalFront?: string;
            originalBack?: string;
            customizationNotes?: string;
          }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            customizationFront: item.customizationFront || "",
            customizationBack: item.customizationBack || "",
            originalFront: item.originalFront || "",
            originalBack: item.originalBack || "",
            customizationNotes: item.customizationNotes || "",
          })),
        },
      },
    });

    await prisma.pendingOrder.delete({ where: { id: pendingOrderId } });
    console.log("Ordine salvato con indirizzo spedizione!");
  } catch (err) {
    console.error("Errore:", err);
    return NextResponse.json({ error: "Errore" }, { status: 500 });
  }
}

  return NextResponse.json({ received: true });
}