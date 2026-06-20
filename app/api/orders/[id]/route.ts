import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (body.trackingNumber && order.customerEmail) {
    try {
      const result = await resend.emails.send({
        from: "AkiraPrint <onboarding@resend.dev>",
        to: order.customerEmail,
        subject: `Il tuo ordine #${order.id} è in viaggio! 📦`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #FFD000;">Il tuo ordine è stato spedito!</h2>
            <p>Ciao ${order.customerName},</p>
            <p>Il tuo ordine <strong>#${order.id}</strong> è in viaggio verso di te.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Numero di tracking:</strong></p>
              <p style="margin: 4px 0 0; font-size: 18px;">${order.trackingNumber}</p>
            </div>
            <p>Indirizzo di consegna:</p>
            <p style="color: #666;">
              ${order.shippingAddress}<br>
              ${order.shippingZip} ${order.shippingCity} (${order.shippingCountry})
            </p>
          </div>
        `,
      });
      console.log("Risultato invio email:", JSON.stringify(result));
    } catch (err) {
      console.error("Errore invio email tracking:", err);
    }
  }

  return NextResponse.json(order);
}