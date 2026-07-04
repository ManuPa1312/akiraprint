import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function sendEmail(to: string, toName: string, subject: string, html: string) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { email: "info@akiraprint.it", name: "AkiraPrint" },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });
  return response;
}

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

      const order = await prisma.order.create({
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

      // Email conferma ordine con Brevo
      if (customerDetails?.email) {
        try {
          await sendEmail(
            customerDetails.email,
            customerDetails.name || "",
            `✅ Ordine #${order.id} confermato — AkiraPrint`,
            `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #FFD000;">Ordine confermato! 🎉</h2>
                <p>Ciao ${customerDetails.name || ""},</p>
                <p>Abbiamo ricevuto il tuo ordine <strong>#${order.id}</strong> e lo stiamo già prendendo in carico.</p>
                <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 0 0 8px; font-weight: bold;">Riepilogo ordine:</p>
                  ${items.map((item: { id: number; quantity: number; price: number }) => `
                    <div style="padding: 4px 0; border-bottom: 1px solid #eee;">
                      <span>Prodotto #${item.id} × ${item.quantity} — €${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  `).join("")}
                  <div style="padding: 8px 0; font-weight: bold;">
                    Totale: €${order.total.toFixed(2)}
                  </div>
                </div>
                <p>Indirizzo di consegna:</p>
                <p style="color: #666;">
                  ${order.shippingAddress}<br>
                  ${order.shippingZip} ${order.shippingCity} (${order.shippingCountry})
                </p>
                <p style="margin-top: 16px;">Ti invieremo un'altra email non appena il tuo ordine sarà spedito con il numero di tracking.</p>
                <p style="margin-top: 24px; color: #999; font-size: 13px;">Grazie per aver scelto AkiraPrint!</p>
              </div>
            `
          );
          console.log("Email conferma inviata con Brevo a", customerDetails.email);
        } catch (err) {
          console.error("Errore email Brevo:", err);
        }
      }

      await prisma.pendingOrder.delete({ where: { id: pendingOrderId } });
      console.log("Ordine salvato!");
    } catch (err) {
      console.error("Errore:", err);
      return NextResponse.json({ error: "Errore" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}