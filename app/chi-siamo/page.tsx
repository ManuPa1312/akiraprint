import Link from "next/link";

export default function ChiSiamoPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="text-center py-24 px-6 bg-[#f9f9f9]">
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          La nostra storia
        </p>
        <h1 className="text-5xl font-black mb-6 leading-tight">
          Artigiani della stampa,<br />non un magazzino anonimo
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Perche AkiraPrint? Abbiamo deciso di chiamare la nostra azienda come la nostra cucciola a 4 zampe che ci segue da tanti anni!
        </p>
      </section>

      {/* Storia con illustrazione */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Illustrazione */}
          <div className="flex justify-center">
            <img
              src="/hero-bg.png"
              alt="Il team di AkiraPrint nel laboratorio"
              className="w-full max-w-sm md:max-w-full rounded-2xl shadow-sm"
            />
          </div>

          {/* Testo */}
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Dopo anni di esperienza nel settore come dipendenti, abbiamo deciso di metterci in proprio e dare vita a un progetto tutto nostro: <strong>Akira Print</strong>.
            </p>
            <p>
              Non siamo una grande azienda con magazzini automatizzati e centralini anonimi. Siamo due persone che hanno scelto di affidarsi alle proprie capacità, con la voglia di portare avanti un lavoro fatto bene, prodotto dopo prodotto.
            </p>
            <p>
              Ogni maglia, cappellino o gadget che esce dal nostro laboratorio viene <strong>lavorato singolarmente</strong>, con la cura che solo un vero artigiano può dare. Non stampiamo in serie senza criterio: ogni ordine è seguito da inizio a fine, che sia un pezzo singolo o una grande quantità per un'azienda.
            </p>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-20 px-6 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-14">Cosa ci rende diversi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">🧵</div>
              <h3 className="font-bold text-lg mb-2">Lavorazione artigianale</h3>
              <p className="text-gray-500 text-sm">
                Ogni prodotto è realizzato uno ad uno, con attenzione ai dettagli che la produzione di massa non può garantire.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Assistenza diretta</h3>
              <p className="text-gray-500 text-sm">
                Parli direttamente con noi, non con un centralino. Su WhatsApp o al telefono, siamo sempre raggiungibili.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-bold text-lg mb-2">Passione vera</h3>
              <p className="text-gray-500 text-sm">
                Questo non è solo un lavoro per noi: è un progetto in cui crediamo, costruito con le nostre mani.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA contatti */}
      <section className="py-20 px-6 text-center" style={{ background: "var(--accent)" }}>
        <h2 className="text-3xl font-black mb-4 text-black">Hai domande? Parliamone direttamente</h2>
        <p className="text-black/80 mb-8 max-w-xl mx-auto">
          Niente bot, niente attese infinite. Scrivici o chiamaci: ti risponderemo noi, di persona.
        </p>
        <Link
          href="/preventivo"
          className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition inline-block"
        >
          Contattaci
        </Link>
      </section>
    </main>
  );
}