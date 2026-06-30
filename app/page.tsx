import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
  where: { featured: true },
  orderBy: { createdAt: "desc" },
  take: 6,
});

  return (
    <main>
{/* Hero */}
      <section className="relative text-center py-20 md:py-32 px-4 sm:px-6 bg-[#f9f9f9] overflow-hidden">
  <div
  className="absolute inset-0 bg-cover bg-no-repeat"
  style={{
    backgroundImage: "url('/hero-bg.png')",
    backgroundPosition: 10,
    opacity: 0.08,
  }}


/>

        {/* Forme decorative sfumate */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            background: "var(--accent)",
            opacity: 0.15,
            filter: "blur(80px)",
            top: "-150px",
            right: "-100px",
          }}
        ></div>
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "350px",
            height: "350px",
            background: "var(--accent)",
            opacity: 0.1,
            filter: "blur(70px)",
            bottom: "-100px",
            left: "-80px",
          }}
        ></div>

        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
            Maglie · Cappellini · Gadget
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Il tuo stile,<br />
            <span style={{ color: "var(--accent)" }}>personalizzato</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto px-2">
            Grafiche originali e prodotti su misura per privati e aziende. Dal singolo pezzo alle grandi quantità.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-10">
            <Link href="/shop" className="btn-primary">
              Scopri il catalogo
            </Link>
            <Link href="/preventivo" className="btn-secondary">
              Richiedi preventivo
            </Link>
          </div>

          {/* Badge fiducia */}
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm text-gray-500 px-2">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pagamento sicuro
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Spedizione tracciata
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Spedizioni in Italia
            </span>
          </div>
        </div>
      </section>
      {/* Come funziona */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-white">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 md:mb-14">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
          {[
            {
              step: "01",
              title: "Scegli il prodotto",
              desc: "Esplora il catalogo e trova maglie, cappellini e gadget.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                </svg>
              ),
            },
            {
              step: "02",
              title: "Personalizza",
              desc: "Carica la tua grafica o scegli tra i nostri design originali.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Ricevi a casa",
              desc: "Stampiamo e spediamo direttamente da te, velocemente.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="mb-3" style={{ color: "var(--accent)" }}>{item.icon}</div>
              <span className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--accent)" }}>{item.step}</span>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>{/* Chi siamo - anteprima */}
<section className="py-16 md:py-20 px-4 sm:px-6 bg-white">
  <div className="max-w-5xl mx-auto">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Illustrazione */}
      <div className="flex justify-center order-2 md:order-1">
        <img
          src="/hero-bg.png"
          alt="Il team di AkiraPrint"
          className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-sm"
        />
      </div>

      {/* Testo */}
      <div className="order-1 md:order-2">
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          Chi siamo
        </p>
        <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
          Non una fabbrica anonima.<br />
          <span style={{ color: "var(--accent)" }}>Siamo noi.</span>
        </h2>
        <p className="text-gray-500 text-lg mb-4 leading-relaxed">
          Un piccolo laboratorio artigianale dove ogni prodotto passa dalle nostre mani,
           uno per uno.
        </p>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Dopo anni come dipendenti nel settore, abbiamo scelto di metterci in proprio 
          e fare le cose a modo nostro: con cura, qualità e un contatto diretto con ogni cliente.
        </p>
        <Link
          href="/chi-siamo"
          className="inline-block font-bold px-6 py-3 rounded-full transition"
          style={{ background: "var(--accent)", color: "black" }}
        >
          Scopri la nostra storia →
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Prodotti in evidenza */}
      {products.length > 0 && (
        <section className="py-16 md:py-20 px-4 sm:px-6 bg-[#f9f9f9]">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 md:mb-14">I più amati</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {products.map((product: { id: number; name: string; price: number; category: string; image: string }) => (
              <Link key={product.id} href={`/shop/${product.id}`} className="card bg-white">
                <div className="h-56 overflow-hidden">
                  <img
                    src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--accent)" }}>{product.category}</p>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-500">€{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop" className="btn-primary">Vedi tutto il catalogo</Link>
          </div>
        </section>
      )}

      {/* Banner personalizzazione */}
      <section className="py-16 md:py-20 px-4 sm:px-6 text-white text-center" style={{ background: "var(--accent)" }}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Vuoi un prodotto personalizzato?</h2>
        <p className="text-base sm:text-lg mb-8 opacity-90 px-2">Per aziende, eventi, team sportivi o regali unici. Preventivo gratuito.</p>
        <Link href="/preventivo" className="bg-white font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition inline-block" style={{ color: "var(--accent)" }}>
          Richiedi un preventivo
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 sm:px-6 text-center text-gray-400 text-sm bg-white">
        <p className="text-xl font-black mb-3 text-black">
          AKIRA<span style={{ color: "var(--accent)" }}>PRINT</span>
        </p>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <a href="#" className="hover:text-[#F4721E] transition">Instagram</a>
          <a href="#" className="hover:text-[#F4721E] transition">TikTok</a>
          <a href="/contatti" className="hover:text-[#FFD000] transition">Contatti</a>
        </div>
        <p>Akira Print © 2026 — Tutti i diritti riservati</p>
      </footer>
    </main>
  );
}