"use client";

import { useState } from "react";

export default function PreventivoPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefono: "",
    azienda: "",
    prodotto: "",
    quantita: "",
    descrizione: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!form.nome || !form.email || !form.prodotto || !form.quantita) {
    alert("Compila almeno nome, email, prodotto e quantità.");
    return;
  }
  setLoading(true);

  const res = await fetch("/api/preventivo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (res.ok) {
    setSent(true);
  } else {
    alert("Errore nell'invio. Riprova o scrivici direttamente.");
  }
  setLoading(false);
};

  if (sent) {
    return (
      <main className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-black mb-3">Richiesta inviata!</h1>
          <p className="text-gray-500 mb-6">
            Grazie {form.nome}! Ti contatteremo entro 24 ore all'indirizzo <strong>{form.email}</strong> con il tuo preventivo personalizzato.
          </p>
          <a href="/" className="btn-primary">Torna alla home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
            Ordini grandi e aziende
          </p>
          <h1 className="text-4xl font-black mb-4">Richiedi un preventivo</h1>
          <p className="text-gray-500">
            Per ordini aziendali, eventi, squadre sportive o grandi quantità. Risponderemo entro 24 ore.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold block mb-1">Nome e cognome *</label>
              <input
                placeholder="Mario Rossi"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Email *</label>
              <input
                type="email"
                placeholder="mario@esempio.it"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Telefono</label>
              <input
                placeholder="+39 333 1234567"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Azienda / Organizzazione</label>
              <input
                placeholder="Nome azienda (opzionale)"
                value={form.azienda}
                onChange={(e) => setForm({ ...form, azienda: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold block mb-1">Tipo di prodotto *</label>
              <select
                value={form.prodotto}
                onChange={(e) => setForm({ ...form, prodotto: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              >
                <option value="">Seleziona...</option>
                <option value="maglie">Maglie</option>
                <option value="cappellini">Cappellini</option>
                <option value="gadget">Gadget</option>
                <option value="misto">Prodotti misti</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Quantità stimata *</label>
              <select
                value={form.quantita}
                onChange={(e) => setForm({ ...form, quantita: e.target.value })}
                className="border rounded-xl px-4 py-3 w-full"
              >
                <option value="">Seleziona...</option>
                <option value="10-50">10–50 pezzi</option>
                <option value="50-100">50–100 pezzi</option>
                <option value="100-500">100–500 pezzi</option>
                <option value="500+">500+ pezzi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Descrizione della richiesta</label>
            <textarea
              placeholder="Descrivi la tua idea: tipo di stampa, colori, posizione logo, tempistiche, ecc..."
              value={form.descrizione}
              onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-black transition disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {loading ? "Invio in corso..." : "Invia richiesta preventivo"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Risponderemo entro 24 ore. Per urgenze scrivi a{" "}
            <span style={{ color: "var(--accent)" }}>info@akiraprint.it</span>
          </p>
        </div>

        {/* Info aggiuntive */}
        <div className="grid md:grid-cols-3 gap-4 mt-8 text-center">
          {[
            { icon: "⚡", title: "Risposta in 24h", desc: "Ti contatteremo rapidamente con un preventivo su misura" },
            { icon: "💰", title: "Prezzi vantaggiosi", desc: "Più pezzi ordini, più risparmi grazie ai nostri prezzi a scaglioni" },
            { icon: "🎨", title: "Supporto grafico", desc: "Il nostro team ti aiuta a ottimizzare la grafica per la stampa" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}