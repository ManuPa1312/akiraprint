import { NextResponse } from "next/server";

async function sendEmail(to: string, toName: string, subject: string, html: string, replyTo?: string) {
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
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });
  return response;
}

export async function POST(req: Request) {
  const { nome, email, telefono, azienda, prodotto, quantita, descrizione } = await req.json();

  try {
    await sendEmail(
      "info@akiraprint.it",
      "AkiraPrint",
      `Nuova richiesta preventivo da ${nome}`,
      `
        <h2>Nuova richiesta preventivo</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nome</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${nome}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefono</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${telefono || "Non fornito"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Azienda</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${azienda || "Non fornita"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Prodotto</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${prodotto}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantità</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${quantita}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Descrizione</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${descrizione || "Non fornita"}</td></tr>
        </table>
        <p style="margin-top: 16px; color: #666;">Rispondi direttamente a questa email per contattare il cliente.</p>
      `,
      email
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
  }
}