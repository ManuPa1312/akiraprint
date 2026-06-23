import Link from "next/link";

export default function ContattiPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="text-center py-20 px-6 bg-[#f9f9f9]">
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          Siamo qui per te
        </p>
        <h1 className="text-5xl font-black mb-4">Contattaci</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Parli direttamente con noi, non con un bot. Rispondiamo sempre entro 24 ore.
        </p>
      </section>

      {/* Contatti */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#f9f9f9] rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold mb-1">Email</h3>
            <p className="text-gray-500 text-sm mb-3">Per preventivi e info generali</p>
            <a href="mailto:info@akiraprint.it" className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
              info@akiraprint.it
            </a>
          </div>
          <div className="bg-[#f9f9f9] rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold mb-1">WhatsApp</h3>
            <p className="text-gray-500 text-sm mb-3">Risposta rapida anche in orari flessibili</p>
            <a href="https://wa.me/39XXXXXXXXXX" className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
              Scrivici su WhatsApp
            </a>
          </div>
          <div className="bg-[#f9f9f9] rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold mb-1">Preventivo</h3>
            <p className="text-gray-500 text-sm mb-3">Per ordini grandi o aziende</p>
            <Link href="/preventivo" className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
              Richiedi preventivo →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-3xl font-black mb-10 text-center">Domande frequenti</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              q: "Quanto tempo ci vuole per ricevere il mio ordine?",
              a: "I tempi di produzione variano in base al prodotto e alla complessità della personalizzazione. In genere 3-5 giorni lavorativi per la produzione + i tempi di spedizione (standard 3-5 giorni, express 1-2 giorni).",
            },
            {
              q: "Posso ordinare anche un solo pezzo?",
              a: "Sì! Lavoriamo sia per ordini singoli che per grandi quantità. Non abbiamo un minimo d'ordine per la maggior parte dei prodotti.",
            },
            {
              q: "In che formato devo inviare la grafica?",
              a: "Accettiamo JPG, PNG, PDF, AI, EPS e SVG fino a 10MB. Per una stampa di qualità ottimale consigliamo file vettoriali (AI, EPS, SVG) o PNG ad alta risoluzione (almeno 300 DPI).",
            },
            {
              q: "Posso vedere un'anteprima prima della stampa?",
              a: "Per ordini grandi o complessi possiamo inviare una bozza di approvazione via email prima di procedere. Per ordini standard ci fidiamo del file che ci invii — se hai dubbi scrivici prima!",
            },
            {
              q: "Fate spedizioni in tutta Italia?",
              a: "Sì, spediamo in tutta Italia, San Marino e Città del Vaticano. La spedizione è tracciata e riceverai il numero di tracking via email.",
            },
            {
              q: "Posso cambiare o annullare un ordine?",
              a: "Puoi modificare o annullare un ordine solo se non è ancora entrato in produzione. Scrivici appena possibile via email o WhatsApp e faremo il possibile per aiutarti.",
            },
            {
              q: "Come funziona il ricamo rispetto alla stampa?",
              a: "La stampa (DTF o serigrafia) è ideale per grafiche con molti colori e dettagli. Il ricamo dà un effetto più premium e durevole, perfetto per loghi semplici su cappellini e felpe. Il ricamo può avere un piccolo sovrapprezzo.",
            },
            {
              q: "Fate fattura per le aziende?",
              a: "Sì, emettiamo fattura per ordini aziendali. Scrivici prima di completare l'ordine con i tuoi dati fiscali.",
            },
          ].map((item, i) => (
            <details key={i} className="border rounded-xl overflow-hidden group">
              <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold hover:bg-gray-50 transition list-none">
                {item.q}
                <span className="text-xl transition group-open:rotate-45 shrink-0 ml-4">+</span>
              </summary>
              <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ background: "var(--accent)" }}>
        <h2 className="text-3xl font-black mb-4 text-black">Non hai trovato risposta?</h2>
        <p className="text-black/80 mb-8">Scrivici direttamente — rispondiamo sempre.</p>
        
        <a  href="mailto:info@akiraprint.it"
          className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition inline-block"
        >
          Scrivici ora
        </a>
      </section>
    </main>
  );
}