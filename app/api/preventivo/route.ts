import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { nome, email, telefono, azienda, prodotto, quantita, descrizione } = await req.json();

  try {
    await resend.emails.send({
      from: "AkiraPrint <onboarding@resend.dev>",
      to: "info@akiraprint.it",
      subject: `Nuova richiesta preventivo da ${nome}`,
      html: `
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
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
  }
}
