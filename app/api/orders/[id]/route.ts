import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      await sendEmail(
        order.customerEmail,
        order.customerName || "",
        `Il tuo ordine #${order.id} è in viaggio! 📦`,
        `
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
            <p style="margin-top: 16px; color: #999; font-size: 13px;">Grazie per aver scelto AkiraPrint!</p>
          </div>
        `
      );
      console.log("Email tracking inviata con Brevo a", order.customerEmail);
    } catch (err) {
      console.error("Errore invio email tracking:", err);
    }
  }

  return NextResponse.json(order);
}